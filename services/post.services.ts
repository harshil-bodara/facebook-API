import sequelize from '../config/dbConfig'; // Adjust the import if necessary
import { deleteImageFromCloudinary, extractPublicId } from '../utils/cloudinary.utils';
import Post from '../models/post.model';
import PostImage from '../models/postImage.model';
import PostLike from '../models/postlike.model';
import User from '../models/user.model';
import Comment from '../models/comment.model';
import FriendRequest from '../models/friendRequest.model';
import { DATE, Op } from 'sequelize';


// Post services 
const createPostWithImage = async (userId: number, caption: string, files: Express.Multer.File[]) => {
  console.log("userId====>", userId);
  console.log("caption===>", caption);
  console.log("files==>", files);

  try {
    // Create the post
    const post = await Post.create({ user_id: userId, caption });
    console.log("Created post:", post.dataValues);

    const postId = post.get("post_id"); // ✅ correct way to access post_id

    if (files && files.length > 0) {
      const imageUrls = files.map((file) => file.path);
      const imagePromises = imageUrls.map(async (url) => {
        try {
          console.log("Creating PostImage for post_id:", postId, "with image_url:", url);
          const createdImage = await PostImage.create({ post_id: postId, image_url: url });
          console.log("PostImage created successfully:", createdImage.dataValues);
        } catch (error) {
          console.error("Error creating PostImage:", error);
        }
      });

      await Promise.all(imagePromises);
    }

    return post;
  } catch (err) {
    console.error("Post creation error:", err);
    throw err;
  }
};


// Update an existing post
export const updatePostService = async (
  postId: number,
  caption: string,
  files: Express.Multer.File[],
  userId: number
) => {
  console.log("Attempting to find post with ID:", postId);

  // Check if postId is valid
  if (isNaN(postId)) {
    throw new Error("Invalid postId provided");
  }

  // Fetch the post by primary key (postId) with its associated images
  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: 'PostImages' }],
    raw: false // This is fixed now
  });

  console.log("Post found:", post);
  console.log("Post.user_id:", post?.user_id);
  console.log("User ID:", userId);

  // Log if the post is not found
  if (!post) {
    console.log(`No post found with ID: ${postId}`);
    throw new Error("Post not found");
  }

  // Check if the current user is the owner of the post
  if (post.user_id !== userId) {
    console.log("User is not authorized to update this post");
    throw new Error("You are not authorized to update this post");
  }

  // Update the caption if it's provided
  if (caption) {
    post.caption = caption;
    await post.save();
  }

  // If files are provided, update the images
  if (files && files.length > 0) {
    // Delete existing images from Cloudinary and the database
    for (const image of post.PostImages || []) {
      const publicId = extractPublicId(image.image_url);
      if (publicId) {
        console.log("Deleting image from Cloudinary:", publicId);
        await deleteImageFromCloudinary(publicId);
      }
    }

    // Delete old image records from the PostImage table
    console.log("Deleting old images from database...");
    await PostImage.destroy({ where: { post_id: post.post_id } });

    // Create new image records for the new files
    const newImageRecords = files.map(file => ({
      post_id: post.post_id,
      image_url: file.path,
    }));

    // Bulk insert new image records
    console.log("Inserting new image records...");
    await PostImage.bulkCreate(newImageRecords);
  }

  // Fetch the updated post with images
  const updatedPost = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: 'PostImages' }],
    raw: false
  });

  // Return the updated post
  return updatedPost;
};
// Delete a post along with its images
const deletePostService = async (postId: number, userId: number) => {
  console.log("postId", postId);
  console.log("userId", userId);

  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage, as: 'PostImages' }],
  });

  if (!post) throw new Error('Post not found');
  if (post.user_id !== userId) throw new Error('You are not authorized to delete this post');

  // ✅ Loop through associated images
  for (const image of post.PostImages || []) {
    const publicId = extractPublicId(image.image_url);
    if (publicId) await deleteImageFromCloudinary(publicId);
  }

  // ✅ Delete images from DB
  await PostImage.destroy({ where: { post_id: post.post_id } });

  // ✅ Delete the post
  await post.destroy();

  return 'Post and images deleted successfully';
};

// Fetch posts by user ID
const getPostsByUserIdService = async (userId: number) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: userId },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM post_likes AS pl
              WHERE pl.post_id = "Post"."post_id"
            )`),
            'totalLikes',
          ],
        ],
      },
      include: [
        {
          model: PostImage,
          attributes: ['image_url'],
        },
        {
          model: PostLike,
          attributes: ['postlike_id', 'user_id', 'post_id', 'created_at'],
          include: [
            {
              model: User,
              as: 'liker',
              attributes: ['user_id', 'username'],
            },
          ],
        },
        {
          model: User,
          as: 'postOwner',
          attributes: [
            'user_id',
            'username',
            'email',
            'first_name',
            'last_name',
            'profile',
            'bio',
          ],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['comment_id', 'post_id', 'user_id', 'content', 'created_at'],
          include: [
            {
              model: User,
              as: 'commenter',
              attributes: ['user_id', 'username'],
            },
          ],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    return posts;
  } catch (error) {
    console.error('Service Error - getPostsByUserId:', error);
    throw new Error('Unable to fetch user posts');
  }
};


// Fetch accepted friend IDs
const getAcceptedFriendIds = async (userId: number) => {
  console.log("userId",userId);
  
  const friends = await FriendRequest.findAll({
    where: {
      status: 'accepted',
      [Op.or]: [
        { sender_id: userId },
        { receiver_id: userId },
      ],
    },
  });

  const friendIds = friends.map(friend =>
    friend.sender_id === userId ? friend.receiver_id : friend.sender_id
  );

  return friendIds;
};

// Get friends' posts
const getFriendsPostsService = async (userId: number) => {
  const friendIds = await getAcceptedFriendIds(userId);
  console.log("friendIds",friendIds);
  

  const posts = await Post.findAll({
    where: {
      user_id: {
        [Op.in]: friendIds,
      },
    },
    include: [
      {
        model: PostImage,
        attributes: ['image_url'],
      },
      {
        model: PostLike,
        attributes: ['postlike_id', 'user_id', 'post_id', 'created_at'],
        include: [
          {
            model: User,
            as: 'liker',
            attributes: ['user_id', 'username'],
          },
        ],
      },
      {
        model: User,
        as: 'postOwner',
        attributes: ['user_id', 'username', 'first_name', 'last_name'],
      },
      {
        model: Comment,
        as: 'comments',
        attributes: ['comment_id', 'post_id', 'user_id', 'content', 'created_at'],
        include: [
          {
            model: User,
            as: 'commenter',
            attributes: ['user_id', 'username'],
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return posts;
};

// Find a post like
const findPostLike = async (userId: number, postId: number) => {
  return await PostLike.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
};

// Like a post
const likedPost = async (userId: number, postId: number) => {
  return await PostLike.create({
    user_id: userId,
    post_id: postId,
  });
};

// Unlike a post
const unlikedPost = async (likeInstance: PostLike) => {
  return await likeInstance.destroy();
};
// Comment a Post 
const createNewComment = async ({ userId, postId, content }: { userId: number, postId: number, content: string }) => {
  // Sequelize automatically handles `created_at` and `updated_at` due to `timestamps: true`
  const newComment = await Comment.create({
    user_id: userId,
    post_id: postId,
    content,
  });

  return newComment;
};

// Fetch all comments
const fetchAllComments = async () => {
  return await Comment.findAll();
};

// Fetch comments by post ID
const fetchCommentsByPostId = async (postId: number) => {
  console.log("postId",postId);
  
  return await Comment.findAll({
    where: { post_id: postId },
    include: [{ model: User, attributes: ['user_id', 'username'] }],
    order: [['created_at', 'DESC']],
  });
};

// Fetch comments by user ID
const fetchCommentsByUserId = async (userId: number) => {
  return await Comment.findAll({ where: { user_id: userId } });
};

// Modify a comment
const modifyComment = async (commentId: number, content: string) => {
  const [updated] = await Comment.update({ content }, { where: { comment_id: commentId } });
  if (updated) {
    return await Comment.findByPk(commentId);
  }
  return null;
};

// Remove a comment
const removeComment = async (commentId: number) => {
  return await Comment.destroy({ where: { comment_id: commentId } });
};

export default {
  createPostWithImage,
  updatePostService,
  deletePostService,
  fetchAllComments,
  createNewComment,
  fetchCommentsByPostId,
  getPostsByUserIdService,
  fetchCommentsByUserId,
  modifyComment,
  removeComment,
  unlikedPost,
  likedPost,
  findPostLike,
  getFriendsPostsService,
};

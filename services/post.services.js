import sequelize from '../config/dbConfig.js';
import { deleteImageFromCloudinary, extractPublicId } from '../utils/cloudinary.utils.js';
import Post from '../models/post.model.js';
import PostImage from '../models/postImage.model.js';
import PostLike from '../models/postlike.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';
import FriendRequest from '../models/friendRequest.model.js';
import { Op } from 'sequelize';

// Create a post with image(s)
const createPostWithImage = async (userId, caption, files) => {
  const post = await Post.create({ user_id: userId, caption });

  if (files && files.length > 0) {
    const imageUrls = files.map((file) => file.path);
    const imagePromises = imageUrls.map((url) =>
      PostImage.create({ post_id: post.post_id, image_url: url })
    );
    await Promise.all(imagePromises);
  }

  return post;
};

// Update an existing post
const updatePostService = async (postId, caption, files, userId) => {
  console.log("postId",postId);
  console.log("caption",caption);
  console.log("files",files);
  console.log("userId",userId);

  
  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage }],
  });

  if (!post) throw new Error('Post not found');
  if (post.user_id !== userId) throw new Error('You are not authorized to update this post');

  post.caption = caption || post.caption;
  await post.save();

  if (files && files.length > 0) {
    // Delete previous images from Cloudinary
    for (const image of post.PostImages) {
      const publicId = extractPublicId(image.image_url);
      if (publicId) await deleteImageFromCloudinary(publicId);
    }

    // Remove old image entries from DB
    await PostImage.destroy({ where: { post_id: post.post_id } });

    // Add new images to DB
    const newImageUrls = files.map((file) => file.path);
    const createImagePromises = newImageUrls.map((url) =>
      PostImage.create({ post_id: post.post_id, image_url: url })
    );
    await Promise.all(createImagePromises);
  }

  const updatedPost = await Post.findByPk(postId, {
    include: [{ model: PostImage }],
  });

  return updatedPost;
};

// Delete a post along with its images
const deletePostService = async (postId, userId) => {
  const post = await Post.findByPk(postId, {
    include: [{ model: PostImage }],
  });

  if (!post) throw new Error('Post not found');
  if (post.user_id !== userId) throw new Error('You are not authorized to delete this post');

  // Delete images from Cloudinary
  for (const image of post.PostImages) {
    const publicId = extractPublicId(image.image_url);
    if (publicId) await deleteImageFromCloudinary(publicId);
  }

  // Remove images from DB and delete the post
  await PostImage.destroy({ where: { post_id: post.post_id } });
  await post.destroy();

  return 'Post and images deleted successfully';
};
const getPostsByUserIdService = async (userId) => {
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
          model: Comment, // assuming your model is named Comment
          as: 'comments', // alias based on your association
          attributes: ['id', 'post_id', 'user_id', 'content', 'created_at'],
          include: [
            {
              model: User,
              as: 'commenter', // alias used in your association
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


const getAcceptedFriendIds = async (userId) => {
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

const getFriendsPostsService = async (userId) => {
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
        model: Comment, // assuming your model is named Comment
        as: 'comments', // alias based on your association
        attributes: ['id', 'post_id', 'user_id', 'content', 'created_at'],
        include: [
          {
            model: User,
            as: 'commenter', // alias used in your association
            attributes: ['user_id', 'username'],
          },
        ],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  return posts;
};




const findPostLike = async (userId, postId) => {
  return await PostLike.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
};

 const likedPost = async (userId, postId) => {
  return await PostLike.create({
    user_id: userId,
    post_id: postId,
  });
};

 const unlikedPost = async (likeInstance) => {
  return await likeInstance.destroy();
};

const createNewComment = async ({ userId, postId, content }) => {
  return await Comment.create({
    user_id: userId,
    post_id: postId,
    content,
  });
};

const fetchAllComments = async () => {
  return await Comment.findAll();
};

const fetchCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { post_id: postId },
    include: [{ model: User, attributes: ['user_id', 'username'] }],
    order: [['created_at', 'DESC']],
  });
};

const fetchCommentsByUserId = async (userId) => {
    console.log("get comments vy user",userId);
    
  return await Comment.findAll({ where: { user_id: userId } });
};

const modifyComment = async (commentId, content) => {
    console.log("content",content);
    console.log("commentId",commentId);

    
  const [updated] = await Comment.update({ content }, { where: { id: commentId } });
  console.log("updated",updated);
  
  if (updated) {
    return await Comment.findByPk(commentId);
  }
  return null;
};

 const removeComment = async (commentId) => {
  return await Comment.destroy({ where: { id: commentId } });
};

export default{
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
  getFriendsPostsService

}
const { Post, PostImage, PostLike, User, sequelize, Sequelize } = require("../models");
const { createPostWithImage } = require("../services/post.services");
const {
  findPostLike,
  unlikedPost,
  likedPost,
} = require("../services/postLike.service");

const createPost = async (req, res) => {
  const userId = req.user.userId;

  console.log("userId", userId);

  try {
    const { caption } = req.body;
    const files = req.files;
    const post = await createPostWithImage(userId, caption, files);
    res.status(201).json({
      message: "post created successfully",
      post,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
};

const likePost = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await findPostLike(userId, postId);

    if (existingLike) {
      await unlikedPost(existingLike);
      return res.status(200).json({ message: "Post unliked" });
    }

    const like = await likedPost(userId, postId);
    return res.status(201).json({ message: "Post liked", like });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling like" });
  }
};

const unlikePost = async (req, res) => {
  const userId = req.user.userId;
  const postId = req.params.postId;

  try {
    const existingLike = await findPostLike(userId, postId);

    if (!existingLike) {
      return res.status(404).json({ message: "Like not found" });
    }

    await unlikedPost(existingLike);
    return res.status(200).json({ message: "Post unliked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error unliking post" });
  }
};




const getPostsByUserId = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await Post.findAll({
      where: { user_id: userId },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM post_likes AS pl
              WHERE pl.post_id = "Post"."post_id"
            )`),
            "totalLikes"
          ]
        ]
      },
      include: [
        {
          model: PostImage,
          attributes: ["image_url"],
        },
        {
          model: PostLike,
          attributes: ["postlike_id", "user_id", "post_id", "created_at"],
          include: [
            {
              model: User,
              as: "liker",
              attributes: ["user_id", "username"],
            }
          ]
        },
        {
          model: User,
          as: "postOwner",
          attributes: [
            "user_id", "username", "email", "first_name", "last_name", "profile", "bio"
          ]
        }
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};


module.exports = { getPostsByUserId };

module.exports = {
  createPost,
  getPostsByUserId,
  likePost,
  unlikePost,
};

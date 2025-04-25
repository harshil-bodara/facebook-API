
import Post from '../models/post.model.js';

import { createPostWithImage, getFriendsPostsService, getPostsByUserIdService } from '../services/post.services.js';
import { findPostLike, likedPost, unlikedPost } from '../services/postLike.service.js';

const createPost = async (req, res) => {
  const userId = req.user.userId;
  try {
    const { caption } = req.body;
    const files = req.files;
    const post = await createPostWithImage(userId, caption, files);
    res.status(201).json({
      message: "Post created successfully",
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

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { caption } = req.body;
  const files = req.files;
  const userId = req.user.userId;

  try {
    const updatedPost = await updatePostService(postId, caption, files, userId);
    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  try {
    const message = await deletePostService(postId, userId);
    res.status(200).json({
      message,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
};

const getPostsByUserId = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await getPostsByUserIdService(userId);
    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    console.error("Controller Error - getPostsByUserId:", error);
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
};


// ✅ Controller: Fetch posts from accepted friends only
 const getFriendsPostsController = async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await getFriendsPostsService(userId);
    res.status(200).json({
      message: 'Friend posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    console.error('Controller Error - getFriendsPosts:', error);
    res.status(500).json({
      message: 'Error fetching friend posts',
      error: error.message,
    });
  }
};
export {
  createPost,
  getPostsByUserId,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  getFriendsPostsController
};

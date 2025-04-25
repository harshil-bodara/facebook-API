import { createNewComment, fetchAllComments, fetchCommentsByUserId, modifyComment, removeComment } from "../services/comment.service.js";


// Create comment
const createComment = async (req, res) => {
  const userId = req.user.userId;
  const { postId, content } = req.body;

  try {
    if (!userId || !postId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const comment = await createNewComment({ userId, postId, content });
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await fetchAllComments();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get by post ID
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await fetchCommentsByUserId(postId);
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this post" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get by user ID
const getCommentsByUser = async (req, res) => {
  const userId = req.user.userId;

  try {
    const comments = await fetchCommentsByUserId(userId);
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this user" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await modifyComment(commentId, content);
    console.log("updatedComment",updatedComment);
    
    if (updatedComment) {
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const deleted = await removeComment(commentId);
    if (deleted) {
      res.status(200).json({ message: "Comment deleted successfully" });
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createComment,
  getAllComments,
  getCommentsByPost,
  getCommentsByUser,
  updateComment,
  deleteComment,
};

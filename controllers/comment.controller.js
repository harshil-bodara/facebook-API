import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

// Create a comment
const createComment = async (req, res) => {
  const userId = req.user.userId;
  const { postId, content } = req.body;

  console.log("userId:", userId);
  console.log("postId:", postId);
  console.log("content:", content);

  try {
    if (!userId || !postId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const comment = await Comment.create({
      user_id: userId,
      post_id: postId,
      content,
    });

    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments by postId
const getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  console.log("postId:", postId);

  try {
    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        {
          model: User,
          attributes: ['user_id', 'username'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this post" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments for post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get comments by userId
const getCommentsByUser = async (req, res) => {
  const userId = req.user.userId;

  console.log("userId:", userId);

  try {
    const comments = await Comment.findAll({ where: { user_id: userId } });

    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this user" });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  console.log("commentId:", commentId);
  console.log("content:", content);

  try {
    const [updated] = await Comment.update(
      { content },
      { where: { id: commentId } }
    );

    if (updated) {
      const updatedComment = await Comment.findByPk(commentId);
      res.status(200).json(updatedComment);
    } else {
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  console.log("commentId:", commentId);

  try {
    const deleted = await Comment.destroy({ where: { id: commentId } });

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

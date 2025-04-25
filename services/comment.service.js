// services/comment.service.js
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";

export const createNewComment = async ({ userId, postId, content }) => {
  return await Comment.create({
    user_id: userId,
    post_id: postId,
    content,
  });
};

export const fetchAllComments = async () => {
  return await Comment.findAll();
};

export const fetchCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { post_id: postId },
    include: [{ model: User, attributes: ['user_id', 'username'] }],
    order: [['created_at', 'DESC']],
  });
};

export const fetchCommentsByUserId = async (userId) => {
    console.log("get comments vy user",userId);
    
  return await Comment.findAll({ where: { user_id: userId } });
};

export const modifyComment = async (commentId, content) => {
    console.log("content",content);
    console.log("commentId",commentId);

    
  const [updated] = await Comment.update({ content }, { where: { id: commentId } });
  console.log("updated",updated);
  
  if (updated) {
    return await Comment.findByPk(commentId);
  }
  return null;
};

export  const removeComment = async (commentId) => {
  return await Comment.destroy({ where: { id: commentId } });
};


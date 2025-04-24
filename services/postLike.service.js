
import PostLike from '../models/postlike.model.js';

export const findPostLike = async (userId, postId) => {
  return await PostLike.findOne({
    where: {
      user_id: userId,
      post_id: postId,
    },
  });
};

export  const likedPost = async (userId, postId) => {
  return await PostLike.create({
    user_id: userId,
    post_id: postId,
  });
};

export  const unlikedPost = async (likeInstance) => {
  return await likeInstance.destroy();
};


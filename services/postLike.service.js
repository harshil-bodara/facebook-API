const PostLike = require("../models/postlike.model");


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

module.exports = {
  findPostLike,
  likedPost,
  unlikedPost,
};

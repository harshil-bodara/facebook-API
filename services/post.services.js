const { Post, PostImage } = require("../models");

const createPostWithImage = async (userId, caption, files) => {
  console.log("userId", userId);
  console.log("caption", caption);
  console.log("files", files);
  const post = await Post.create({
    user_id: userId,
    caption,
  });
  console.log("post", post);

  if (files && files.length > 0) {
    const imageUrls = files.map((file) => file.path);

    const imagePromises = imageUrls.map((imageUrl) =>
      PostImage.create({
        post_id: post.post_id,
        image_url: imageUrl,
      })
    );

    await Promise.all(imagePromises);
  }

  return post;
};

module.exports = {
  createPostWithImage,
};

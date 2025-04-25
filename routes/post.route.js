
import express from 'express';
import uploadImage from '../middleware/upload.js';
import UserAuthorization from '../middleware/auth.middleware.js';
import { createPost, deletePost, getFriendsPostsController, getPostsByUserId, likePost,  updatePost } from '../controllers/post.controller.js';
import validate from '../validation/validate.helper.js';
import { postSchema } from '../validation/post.validation.js';

const postRouter = express.Router();

postRouter.post(
  '/',
  UserAuthorization,
  uploadImage('post_images').array('images'), 
  createPost
);

postRouter.put(
  '/:postId',
  UserAuthorization,
  uploadImage('post_images').array('images'), 
  validate(postSchema),
  updatePost
);
postRouter.get("/", UserAuthorization, getPostsByUserId);

postRouter.post("/like/:postId", UserAuthorization, likePost);

postRouter.delete("/:postId", UserAuthorization, deletePost);

postRouter.get('/friends/posts', UserAuthorization, getFriendsPostsController);


export default postRouter;
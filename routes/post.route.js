import express from "express";

import verifyToken from "../middleware/verifyToken.js";
import {
  createPost,
  getPostsByUserId,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
  getFriendsPostsController,
} from "../controllers/post.controller.js";

import uploadPostImage from "../middleware/uploadPostImage.js";
import validate from "../middleware/validate.js";
import { postSchema } from "../validations/validation.schemas.js";

const postRouter = express.Router();

postRouter.get("/", verifyToken, getPostsByUserId);

postRouter.post(
  "/",
  verifyToken,
  uploadPostImage.array("images"),
  createPost
);

postRouter.post("/like/:postId", verifyToken, likePost);

postRouter.post("/unlike/:postId", verifyToken, unlikePost);

postRouter.put(
  "/:postId",
  verifyToken,
  uploadPostImage.array("image"),
  validate(postSchema),
  updatePost
);


postRouter.get('/friends/posts', verifyToken, getFriendsPostsController);

postRouter.delete("/:postId", verifyToken, deletePost);

export default postRouter;

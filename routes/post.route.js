import express from "express";

import authMiddleware from "../middleware/auth.js";
import {
  createPost,
  getPostsByUserId,
  likePost,
  unlikePost,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import uploadPostImage from "../middleware/uploadPostImage.js";
import validate from "../middleware/validate.js";
import { postSchema } from "../validations/auth.validation.js";

const postRouter = express.Router();

postRouter.get("/", authMiddleware, getPostsByUserId);

postRouter.post(
  "/",
  authMiddleware,
  uploadPostImage.array("images"),
  createPost
);

postRouter.post("/like/:postId", authMiddleware, likePost);

postRouter.post("/unlike/:postId", authMiddleware, unlikePost);

postRouter.put(
  "/:postId",
  authMiddleware,
  uploadPostImage.array("file"),
  validate(postSchema),
  updatePost
);

postRouter.delete("/:postId", authMiddleware, deletePost);

export default postRouter;

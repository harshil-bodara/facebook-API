import express from "express";

import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentsByUser,
} from "../controllers/comment.controller.js";

import validate from "../middleware/validate.js";
import authMiddleware from "../middleware/auth.js";

import { commentSchema } from "../validations/auth.validation.js";

const commentRouter = express.Router();

commentRouter.post("/", validate(commentSchema), authMiddleware, createComment);

commentRouter.get("/post/:postId", authMiddleware, getCommentsByPost);

commentRouter.get("/user/", authMiddleware, getCommentsByUser);

commentRouter.put("/:commentId", authMiddleware, updateComment);

commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;

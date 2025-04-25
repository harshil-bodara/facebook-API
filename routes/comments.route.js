import express from "express";

import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentsByUser,
} from "../controllers/comment.controller.js";

import validate from "../middleware/validate.js";
import verifyToken from "../middleware/verifyToken.js";

import { commentSchema } from "../validations/validation.schemas.js";

const commentRouter = express.Router();

commentRouter.post("/", validate(commentSchema), verifyToken, createComment);

commentRouter.get("/post/:postId", verifyToken, getCommentsByPost);

commentRouter.get("/user/", verifyToken, getCommentsByUser);

commentRouter.put("/:commentId", verifyToken, updateComment);

commentRouter.delete("/:commentId", verifyToken, deleteComment);

export default commentRouter;

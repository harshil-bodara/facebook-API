import express from "express";

import {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  getCommentsByUser,
} from "../controllers/comment.controller.js";

import validate from "../validation/validate.helper.js";
import { commentSchema } from "../validation/post.validation.js";
import UserAuthorization from "../middleware/auth.middleware.js";


const commentRouter = express.Router();

commentRouter.post("/", validate(commentSchema), UserAuthorization, createComment);

commentRouter.get("/post/:postId", UserAuthorization, getCommentsByPost);

commentRouter.get("/user/", UserAuthorization, getCommentsByUser);

commentRouter.put("/:commentId", UserAuthorization, updateComment);

commentRouter.delete("/:commentId", UserAuthorization, deleteComment);

export default commentRouter;

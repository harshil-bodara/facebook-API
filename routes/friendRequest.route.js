import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../controllers/friendRequest.controller.js";

import authMiddleware from "../middleware/auth.js";

const friendRequestRouter = express.Router();

friendRequestRouter.post("/:receiverId", authMiddleware, sendFriendRequest);

friendRequestRouter.put("/accept/:requestId",authMiddleware,acceptFriendRequest);

friendRequestRouter.put("/reject/:requestId",authMiddleware,rejectFriendRequest);

export default friendRequestRouter;

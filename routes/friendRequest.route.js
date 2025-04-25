import express from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getUserFriendsController,
} from "../controllers/friendRequest.controller.js";

import verifyToken from "../middleware/verifyToken.js";

const friendRequestRouter = express.Router();

friendRequestRouter.get('/currentFriends', verifyToken, getUserFriendsController);

friendRequestRouter.post("/:receiverId", verifyToken, sendFriendRequest);

friendRequestRouter.put("/accept/:requestId",verifyToken,acceptFriendRequest);

friendRequestRouter.put("/reject/:requestId",verifyToken,rejectFriendRequest);


export default friendRequestRouter;

import express from "express";


import UserAuthorization from "../middleware/auth.middleware.js";
import { acceptFriendRequest,  rejectFriendRequest, sendFriendRequest, getUserFriendsController } from "../controllers/friendRequest.controller.js";

const friendRequestRouter = express.Router();

friendRequestRouter.get('/currentFriends', UserAuthorization, getUserFriendsController);

friendRequestRouter.post("/:receiverId", UserAuthorization, sendFriendRequest);

friendRequestRouter.put("/accept/:requestId",UserAuthorization,acceptFriendRequest);

friendRequestRouter.put("/reject/:requestId",UserAuthorization,rejectFriendRequest);


export default friendRequestRouter;

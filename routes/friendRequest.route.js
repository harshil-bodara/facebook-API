const express=require("express");
const { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = require("../controllers/friendRequest.controller");
const authMiddleware = require("../middleware/auth");
const friendRequestRouter=express.Router()
friendRequestRouter.post("/:receiverId", authMiddleware,sendFriendRequest);

friendRequestRouter.put("/accept/:requestId", authMiddleware,acceptFriendRequest);

friendRequestRouter.put("/reject/:requestId", authMiddleware,rejectFriendRequest);
module.exports=friendRequestRouter
// controllers/friendRequest.controller.js
import { checkExistingRequest, getUserFriendsService } from "../services/friendRequest.service.js";
import { updateFriendRequestStatus } from "../services/friendRequest.service.js";
import { getFriendRequestById } from "../services/friendRequest.service.js";
import { createFriendRequest } from "../services/friendRequest.service.js";


const sendFriendRequest = async (req, res) => {
  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;

  try {
    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const existingRequest = await checkExistingRequest(senderId, receiverId);
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const request = await createFriendRequest(senderId, receiverId);
    return res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await getFriendRequestById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await updateFriendRequestStatus(request, "accepted");
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
};

const rejectFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await getFriendRequestById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await updateFriendRequestStatus(request, "rejected");
    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};
const getUserFriendsController = async (req, res) => {
  const userId = req.user.userId;
  console.log("userId",userId);
  
  try {
    const friends = await getUserFriendsService(userId);

    res.status(200).json({
      message: 'Friends fetched successfully',
      data: friends,
    });
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({
      message: 'Failed to fetch friends',
      error: error.message,
    });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getUserFriendsController
};

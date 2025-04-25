import userService from "../services/user.service.js";

export const sendFriendRequest = async (req, res) => {
  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;
  console.log("senderId",senderId);
  console.log("receiverId",receiverId);

  
  try {
    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const existingRequest = await userService.checkExistingRequest(senderId, receiverId);
    console.log("existingRequest",existingRequest);
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }
    
    const request = await userService.createFriendRequest(senderId, receiverId);
    console.log("request",request);
    return res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await userService.getFriendRequestById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await userService.updateFriendRequestStatus(request, "accepted");
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const request = await userService.getFriendRequestById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    await userService.updateFriendRequestStatus(request, "rejected");
    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};
export const getUserFriendsController = async (req, res) => {
  const userId = req.user.userId;
  console.log("userId", userId);

  try {
    const friends = await userService.getUserFriendsService(userId);

    res.status(200).json({
      message: "Friends fetched successfully",
      data: friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({
      message: "Failed to fetch friends",
      error: error.message,
    });
  }
};


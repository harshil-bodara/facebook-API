const { FriendRequest } = require("../models");

const sendFriendRequest = async (req, res) => {
  console.log("send friend request in");

  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;
  console.log("senderId", senderId);
  console.log("receiverId", receiverId);

  try {
    // sender cannot send request to themselves
    if (senderId === parseInt(receiverId)) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself" });
    }

    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    // Create a new friend request
    const request = await FriendRequest.create({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });
    console.log("request", request);

    return res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending friend request" });
  }
};



const acceptFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;
  console.log("requestId", requestId);
  try {
    const request = await FriendRequest.findByPk(requestId);
    console.log("request", request);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }
    request.status = "accepted";
    await request.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
};
const rejectFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;
  console.log("requestId", requestId);

  try {
    const request = await FriendRequest.findByPk(requestId);
    console.log("request", request);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};

import FriendRequest from "../models/friendRequest.model.js";

const sendFriendRequest = async (req, res) => {
  console.log("Send friend request in");

  const senderId = req.user.userId;
  const receiverId = req.params.receiverId;

  console.log("Sender ID:", senderId);
  console.log("Receiver ID:", receiverId);

  try {
    if (senderId === parseInt(receiverId)) {
      return res.status(400).json({
        message: "You cannot send a friend request to yourself",
      });
    }

    const existingRequest = await FriendRequest.findOne({
      where: {
        sender_id: senderId,
        receiver_id: receiverId,
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const request = await FriendRequest.create({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });

    console.log("Request sent:", request);

    return res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Error sending friend request" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  console.log("Request ID:", requestId);

  try {
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = "accepted";
    await request.save();

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Error accepting friend request" });
  }
};

const rejectFriendRequest = async (req, res) => {
  const requestId = req.params.requestId;

  console.log("Request ID:", requestId);

  try {
    const request = await FriendRequest.findByPk(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ message: "Error rejecting friend request" });
  }
};

export {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};

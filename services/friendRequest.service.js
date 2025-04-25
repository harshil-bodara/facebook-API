import { Op } from "sequelize";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

const createFriendRequest = async (senderId, receiverId) => {
  return await FriendRequest.create({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending",
  });
};

const checkExistingRequest = async (senderId, receiverId) => {
  return await FriendRequest.findOne({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });
};

const getFriendRequestById = async (requestId) => {
  return await FriendRequest.findByPk(requestId);
};

const updateFriendRequestStatus = async (request, status) => {
  request.status = status;
  await request.save();
  return request;
};

const getUserFriendsService = async (userId) => {
  const friendRequests = await FriendRequest.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
    include: [
      {
        model: User,
        as: "sender",
        attributes: [
          "user_id",
          "username",
          "first_name",
          "last_name",
          "profile",
        ],
      },
      {
        model: User,
        as: "receiver",
        attributes: [
          "user_id",
          "username",
          "first_name",
          "last_name",
          "profile",
        ],
      },
    ],
  });

  const friends = friendRequests.map((req) => {
    const isSender = req.sender_id === userId;
    return isSender ? req.receiver : req.sender;
  });

  return friends;
};

export {
  createFriendRequest,
  checkExistingRequest,
  getFriendRequestById,
  updateFriendRequestStatus,
  getUserFriendsService,
};

import FriendRequest from "../models/friendRequest.model";
import User from "../models/user.model";
import { Op } from "sequelize";
import { IUserData } from "../types/types";


const findUserByEmailOrUsername = async (
  emailOrUsername: string
): Promise<User | null> => {
  console.log("emailorUsername", emailOrUsername);

  return await User.findOne({
    where: {
      [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
    },
  });
};

const findUserById = async (id: number): Promise<User | null> => {
  return await User.findByPk(id);
};

const createUser = async (userData: IUserData): Promise<User> => {
  return await User.create(userData as any);
};

const createFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest> => {
    return await FriendRequest.create({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    });
};

const checkExistingRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest | null> => {
  return await FriendRequest.findOne({
    where: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });
};

export const getFriendRequestById = async (
  requestId: number
): Promise<FriendRequest | null> => {
  return await FriendRequest.findByPk(requestId);
};

export const updateFriendRequestStatus = async (
  request: FriendRequest,
  status: "pending" | "accepted" | "rejected"
): Promise<FriendRequest> => {
  request.status = status;
  await request.save();
  return request;
};

const getUserFriendsService = async (userId: number) => {
  const friendRequests = await FriendRequest.findAll({
    where: {
      status: "accepted", // only accepted requests
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
    },
    include: [
      {
        model: User,
        as: "sender", // sender details
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
        as: "receiver", // receiver details
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

  const friends = friendRequests.flatMap((req) => {
    const isSender = req.sender_id === userId;
    return isSender ? req.receiver_id : req.sender_id;
  });

  return friends;
};

const updateUser = async (
  userId: number,
  updates: Partial<IUserData>
): Promise<User | null> => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  return await user.update(updates as any);
};

const verifyResetOtp = async (
  emailOrUsername: string,
  otp: string
): Promise<User | null> => {
  const user = await findUserByEmailOrUsername(emailOrUsername);
  if (!user) return null;

  const isOtpValid =
    user.reset_otp === otp && Date.now() < Number(user.reset_otp_expires);

  return isOtpValid ? user : null;
};

export default {
  findUserByEmailOrUsername,
  findUserById,
  createUser,
  createFriendRequest,
  checkExistingRequest,
  getFriendRequestById,
  updateFriendRequestStatus,
  getUserFriendsService,
  updateUser,
  verifyResetOtp,
};

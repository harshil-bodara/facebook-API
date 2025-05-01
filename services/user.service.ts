import FriendRequest from "../models/friendRequest.model";
import User from "../models/user.model";
import { Op } from "sequelize";

// Define types for user-related objects
type UserData = {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  profile: string;
  reset_otp: number;
  reset_otp_expires: number;
  password: string; // Add missing required fields
  biots?: number; // If optional, use "?"
};

// Find a user by email or username
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

// Find a user by ID
const findUserById = async (id: number): Promise<User | null> => {
  return await User.findByPk(id);
};

// Create a new user
const createUser = async (userData: UserData): Promise<User> => {
  return await User.create(userData as any);
};

// Create a friend request
const createFriendRequest = async (
  senderId: number,
  receiverId: number
): Promise<FriendRequest> => {
  return await FriendRequest.create({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending", // status is defaulted to 'pending'
  });
};

// Check if an existing friend request exists
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

// Get a friend request by ID
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

// Get a user's accepted friends
const getUserFriendsService = async (userId: number) => {
  // Fetch all accepted friend requests where the user is either the sender or receiver
  const friendRequests = await FriendRequest.findAll({
    where: {
      status: "accepted", // Only accepted requests
      [Op.or]: [{ sender_id: userId }, { receiver_id: userId }], // Either sender or receiver is the user
    },
    include: [
      {
        model: User,
        as: "sender", // Alias for the sender
        attributes: [
          "user_id",
          "username",
          "first_name",
          "last_name",
          "profile",
        ], // Fields to retrieve for the sender
      },
      {
        model: User,
        as: "receiver", // Alias for the receiver
        attributes: [
          "user_id",
          "username",
          "first_name",
          "last_name",
          "profile",
        ], // Fields to retrieve for the receiver
      },
    ],
  });

  // Extract the user (sender or receiver) depending on which one is the given userId
  const friends = friendRequests.flatMap((req) => {
    const isSender = req.sender_id === userId; // Check if the current user is the sender
    return isSender ? req.receiver_id : req.sender_id; // Return the opposite user
  });

  // // Use Set to ensure unique friends (remove duplicates)
  // const uniqueFriends = Array.from(new Set(friends.map((friend) => friend.user_id)))
  //   .map((userId) => friends.find((friend) => friend.user_id === userId));

  return friends;
};

// U4pdate a user's data
const updateUser = async (
  userId: number,
  updates: Partial<UserData>
): Promise<User | null> => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  // Update the user with partial data
  return await user.update(updates as any);
};

// Verify the reset OTP
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

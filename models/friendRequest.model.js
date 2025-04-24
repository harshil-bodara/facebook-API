const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FriendRequest = sequelize.define(
  "FriendRequest",
  {
    friendrequest_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incrementing field
      allowNull: false,
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending", // Default status is "pending"
    },
  },
  {
    timestamps: true, // Add timestamps (created_at, updated_at)
    underscored: true, // Use snake_case for column names
    tableName: "friend_requests",
  }
);

module.exports = FriendRequest;

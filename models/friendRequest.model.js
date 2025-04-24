
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FriendRequest = sequelize.define(
  'FriendRequest',
  {
    friendrequest_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
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
      defaultValue: 'pending', 
    },
  },
  {
    timestamps: true, 
    underscored: true, 
    tableName: 'friend_requests',
  }
);

export default FriendRequest;

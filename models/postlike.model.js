
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const PostLike = sequelize.define(
  'PostLike',
  {
    postlike_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'post_likes',
    underscored: true,
  }
);

export default PostLike;

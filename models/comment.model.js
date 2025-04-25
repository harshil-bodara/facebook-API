
import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: "post_id",
    },
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "user_id",
    },
    allowNull: false,
  },
});

export default Comment;

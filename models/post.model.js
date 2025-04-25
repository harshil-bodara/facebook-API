
import { DataTypes } from "sequelize";
import sequelize from "../config/dbConfig.js";

const Post = sequelize.define("Post", {
  post_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caption: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: "posts", 
});

export default Post;

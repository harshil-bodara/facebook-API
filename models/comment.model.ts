

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/dbConfig.js";
import Post from "./post.model.js";
import User from "./user.model.js";
import { IComment } from "../types/types.js";


export interface ICommentCreationAttributes
  extends Optional<IComment, "comment_id" | "created_at" | "updated_at"> {}

class Comment
  extends Model<IComment, ICommentCreationAttributes>
  implements IComment
{
  comment_id!: number;
  content!: string;
  created_at!: Date;
  updated_at!: Date;
  post_id!: number;
  user_id!: number;
}

Comment.init(
  {
    comment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true, // Allow null, as it's automatically set when a new record is created
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true, // Allow null, as it's automatically set when a new record is created
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Post, // Reference to the Post model
        key: "post_id",
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // Reference to the User model
        key: "user_id",
      },
      allowNull: false,
    },
  },
  {
    sequelize, // Sequelize instance
    modelName: "Comment",
    tableName: "comments", // The table name in the database
    timestamps: true, // Automatically creates `createdAt` and `updatedAt` fields
    underscored: true, // Convert camelCase to snake_case for column names
    createdAt: "created_at", // Use custom name for the createdAt field
    updatedAt: "updated_at", // Use custom name for the updatedAt field
  }
);

// Define the associations
Comment.belongsTo(Post, { foreignKey: "post_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

export default Comment;

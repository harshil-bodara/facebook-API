import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/dbConfig.js'; // Adjust the path as needed
import { IPostLike } from '../types/types.js';
// Define the type for creation attributes (Make 'postlike_id' optional)
export interface IPostLikeCreationAttributes extends Optional<IPostLike, 'postlike_id'> {}

// Define the PostLike model class
class PostLike extends Model<IPostLike, IPostLikeCreationAttributes> implements IPostLike {
  postlike_id!: number;
  user_id!: number;
  post_id!: number;
}

// Initialize the PostLike model
PostLike.init(
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
    sequelize, // Sequelize instance
    modelName: 'PostLike',
    tableName: 'post_likes',
    timestamps: true,
    underscored: true,
  }
);

export default PostLike;


import { DataTypes } from 'sequelize';
import sequelize from '../config/dbConfig.js';

const PostImage = sequelize.define(
  'PostImage',
  {
    postImage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'post_images',
    underscored: true,
  }
);

export default PostImage;

// import { DataTypes, Model, Optional } from 'sequelize';
// import sequelize from '../config/dbConfig.js'; // Adjust path as needed
// import { IPostImage } from '../types/types.js';



// // Define the type for creation attributes (Make 'postImage_id' optional)
// export interface IPostImageCreationAttributes extends Optional<IPostImage, 'postImage_id'> {}

// // Define the PostImage model class
// class PostImage extends Model<IPostImage, IPostImageCreationAttributes> implements IPostImage {
//   postImage_id!: number;
//   post_id!: number;
//   image_url!: string;
// }

// // Initialize the PostImage model
// PostImage.init(
//   {
//     postImage_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     post_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     image_url: {
//       type: DataTypes.TEXT,  // Sequelize maps `TEXT` to `string` in JavaScript/TypeScript
//       allowNull: false,
//     },
//   },
//   {
//     sequelize, // Sequelize instance
//     modelName: 'PostImage',
//     tableName: 'post_images',
//     timestamps: true,
//     underscored: true,
//   }
// );

// export default PostImage;


import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/dbConfig.js";
import { IPostImage } from "../types/types.js";

export interface IPostImageCreationAttributes extends Optional<IPostImage, 'postImage_id'> {}

class PostImage extends Model<IPostImage, IPostImageCreationAttributes> implements IPostImage {
  postImage_id!: number;
  post_id!: number;
  image_url!: string;
}

PostImage.init(
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
    sequelize,
    modelName: "PostImage",
    tableName: "post_images",
    timestamps: true,
    underscored: true,
  }
);

export default PostImage;
import { Sequelize } from "sequelize";
import sequelize from "../config/dbConfig";
import User from "./user.model";
import Post from "./post.model";
import PostImage from "./postImage.model";
import PostLike from "./postlike.model";
import FriendRequest from "./friendRequest.model";
import Comment from "./comment.model";

// Define the DB type
interface IDb {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  User: typeof User;
  Post: typeof Post;
  PostImage: typeof PostImage;
  PostLike: typeof PostLike;
  FriendRequest: typeof FriendRequest;
  Comment: typeof Comment;
}

const db: IDb = {} as IDb;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Post = Post;
db.PostImage = PostImage;
db.PostLike = PostLike;
db.FriendRequest = FriendRequest;
db.Comment = Comment;

// ------------------ Associations ------------------

// User - Post
// User - Post (Make sure you don't define it again later)
db.User.hasMany(db.Post, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
db.Post.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "postOwner", // Alias should be used only once
});


// User - FriendRequest
db.User.hasMany(db.FriendRequest, {
  foreignKey: "sender_id",
  onDelete: "CASCADE",
});
db.User.hasMany(db.FriendRequest, {
  foreignKey: "receiver_id",
  onDelete: "CASCADE",
});
db.FriendRequest.belongsTo(db.User, { as: "sender", foreignKey: "sender_id" });
db.FriendRequest.belongsTo(db.User, {
  as: "receiver",
  foreignKey: "receiver_id",
});

// Post - PostImage
db.Post.hasMany(db.PostImage, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  as: 'PostImages',  // Define the alias to use in your includes
});

db.PostImage.belongsTo(db.Post, {
  foreignKey: "post_id",
  as: 'Post'  // Optional: Define the alias to use for the associated post
});

// User - PostLike  
db.User.hasMany(db.PostLike, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
});
db.PostLike.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "liker",
});
db.Post.hasMany(db.PostLike, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
});
db.PostLike.belongsTo(db.Post, {
  foreignKey: "post_id",
});

// Post - Comment
db.Post.hasMany(db.Comment, { as: "comments", foreignKey: "post_id" });
db.Comment.belongsTo(db.Post, {
  foreignKey: "post_id",
});
db.Comment.belongsTo(db.User, {
  foreignKey: "user_id",
});
db.Comment.belongsTo(db.User, { as: "commenter", foreignKey: "user_id" });
db.User.hasMany(db.Comment, {
  foreignKey: "user_id",
});

export default db;

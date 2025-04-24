// const sequelize = require("../config/db");
// const User = require("./user.model");

// const db = {};

// db.sequelize = sequelize;
// db.User = require("./user.model");
// db.Post=require("./post.model")
// db.PostImage=require("./postImage.model")
// db.PostLike=require("./postlike.model")

// // user and post
// db.User.hasMany(db.Post,{foreignKey:"user_id",onDelete:"CASCADE"})
// db.Post.belongsTo(db.User,{foreignKey:"user_id"})

// // post and postimage
// db.Post.hasMany(db.PostImage,{foreignKey:"post_id",onDelete:"CASCADE"})
// db.PostImage.belongsTo(db.Post,{foreignKey:"post_id"})

// // user and Postlike
// db.User.hasMany(db.PostLike,{foreignKey:"post_id",onDelete:"CASCADE"})
// db.PostLike.belongsTo(db.User,{foreignKey:"user_id"})

// // post and postlike
// db.Post.hasMany(db.PostLike,{foreignKey:"post_id",onDelete:"CASCADE"})
// db.PostLike.belongsTo(db.Post,{foreignKey:"post_id"})
// module.exports = db;
const sequelize = require("../config/db");

const db = {};
db.sequelize = sequelize;
db.Sequelize = require("sequelize");

db.User = require("./user.model");
db.Post = require("./post.model");
db.PostImage = require("./postImage.model");
db.PostLike = require("./postlike.model");
db.FriendRequest=require("./friendRequest.model")

// Associations
db.User.hasMany(db.Post, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Post.belongsTo(db.User, { foreignKey: "user_id" ,
  as: "postOwner"});

db.User.hasMany(db.FriendRequest, { foreignKey: "sender_id", onDelete: "CASCADE" });
db.User.hasMany(db.FriendRequest, { foreignKey: "receiver_id", onDelete: "CASCADE" });

db.Post.hasMany(db.PostImage, { foreignKey: "post_id", onDelete: "CASCADE" });
db.PostImage.belongsTo(db.Post, { foreignKey: "post_id" });

db.User.hasMany(db.PostLike, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
  });
  
  db.PostLike.belongsTo(db.User, {
    foreignKey: "user_id",
    as: "liker" 
  });
  
db.Post.hasMany(db.PostLike, { foreignKey: "post_id", onDelete: "CASCADE" });
db.PostLike.belongsTo(db.Post, { foreignKey: "post_id" });

module.exports = db;

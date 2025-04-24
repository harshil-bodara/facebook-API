const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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

module.exports = Post;

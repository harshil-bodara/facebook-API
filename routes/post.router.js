const express = require("express");
const authMiddleware = require("../middleware/auth");
const { createPost, getPostsByUserId, likePost, unlikePost } = require("../controllers/post.controller");
const upload = require("../middleware/upload");
const uploadPostImage = require("../middleware/uploadPostImage");
const postrouter = express.Router();
postrouter.get("/",authMiddleware,getPostsByUserId );
postrouter.post("/", authMiddleware, uploadPostImage.array("images"), createPost);
postrouter.post("/like/:postId", authMiddleware,likePost);
postrouter.post("/unlike/:postId", authMiddleware,unlikePost);




module.exports = postrouter;

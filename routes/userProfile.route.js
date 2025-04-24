const express = require("express");
const { updateProfile, getUserProfileData } = require("../controllers/userProfile.controller");
const authMiddleware = require("../middleware/auth");
const validate = require("../middleware/validate");
const { updateProfileSchema } = require("../validations/auth.validation");
const upload = require("../middleware/upload");
const setUploadFolder = require("../middleware/setupFolder");

const userProfileRouter = express.Router();

userProfileRouter.get("/profile", authMiddleware, getUserProfileData);


userProfileRouter.put(
  "/update-profile",
  authMiddleware,
  validate(updateProfileSchema),
  upload.single("profile"),
  updateProfile
);

module.exports = userProfileRouter;

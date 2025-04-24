import express from "express";

import {
  updateProfile,
  getUserProfileData,
} from "../controllers/userProfile.controller.js";

import authMiddleware from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { updateProfileSchema } from "../validations/auth.validation.js";
import upload from "../middleware/upload.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/profile", authMiddleware, getUserProfileData);

userProfileRouter.put(
  "/update-profile",
  authMiddleware,
  validate(updateProfileSchema),
  upload.single("profile"),
  updateProfile
);

export default userProfileRouter;

import express from "express";

import {
  updateProfile,
    getProfile,
} from "../controllers/userProfile.controller.js";

import verifyToken from "../middleware/verifyToken.js";
import validate from "../middleware/validate.js";
import { updateProfileValidationSchema } from "../validations/validation.schemas.js";
import upload from "../middleware/upload.js";

const userProfileRouter = express.Router();

userProfileRouter.get("/profile", verifyToken,   getProfile);

userProfileRouter.put(
  "/profile/update",
  verifyToken,
  validate(updateProfileValidationSchema),
  upload.single("profile"),
  updateProfile
);

export default userProfileRouter;

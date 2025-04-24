import express from "express";

import { login, signup } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/userProfile.controller.js";

import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";

import {
  signupSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/auth.validation.js";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", validate(loginSchema), login);

authRouter.put(
  "/update-profile",
  authMiddleware,
  validate(updateProfileSchema),
  upload.single("profile"),
  updateProfile
);

export default authRouter;

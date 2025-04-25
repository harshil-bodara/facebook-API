import express from "express";

import { login, signup } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/userProfile.controller.js";

import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";
import verifyToken from "../middleware/verifyToken.js";

import {
  signupSchema,
  loginSchema,
  updateProfileValidationSchema,
} from "../validations/validation.schemas.js";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", validate(loginSchema), login);

authRouter.put(
  "/profile/update",
  verifyToken,
  validate(updateProfileValidationSchema),
  upload.single("profile"),
  updateProfile
);

export default authRouter;

import express from "express";

import { login, signup } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/user.controller.js";

import validate from "../validation/validate.helper.js";
import UserAutorization from "../middleware/auth.middleware.js";


import uploadImage from "../middleware/upload.js";
import { loginSchema, signupSchema } from "../validation/auth.validation.js";
import { updateProfileValidationSchema } from "../validation/post.validation.js";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", validate(loginSchema), login);

authRouter.put(
  '/profile/update',
  UserAutorization,
  validate(updateProfileValidationSchema),
  uploadImage ('profile_images').single('profile'), 
  updateProfile
);

export default authRouter;

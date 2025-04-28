import express from "express";

import { forgotPassword, login, resetPassword, signup, verifyOtp } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/user.controller.js";

import validate from "../utils/validate.helper.js";
import UserAutorization from "../middleware/auth.middleware.js";


import { loginSchema, signupSchema } from "../validation/auth.validation.js";

const authRouter = express.Router();

authRouter.post("/signup", validate(signupSchema), signup);

authRouter.post("/login", validate(loginSchema), login);


authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/verify-otp", verifyOtp);

authRouter.post("/reset-password", resetPassword);


export default authRouter;

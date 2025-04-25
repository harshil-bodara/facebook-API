
import express from 'express';
import uploadImage from '../middleware/upload.js';
import { updateProfile, getProfile } from '../controllers/user.controller.js';
import validate from '../validation/validate.helper.js';
import { updateProfileValidationSchema } from '../validation/post.validation.js';
import UserAuthorization from '../middleware/auth.middleware.js';

const userRouter = express.Router();

userRouter.put(
  '/profile/update',
  UserAuthorization,
  validate(updateProfileValidationSchema),
  uploadImage('profile_images').single('profile'), // Single image upload for profile
  updateProfile
);

userRouter.get('/profile', UserAuthorization, getProfile);


export default userRouter;

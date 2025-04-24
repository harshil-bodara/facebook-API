
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from "../config/cloudinaryConfig.js";


const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log('User info from req.user:', req.user);

    return {
      folder: 'profile_images',
      public_id: `${req.user.userId}_profile`,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      overwrite: true,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;

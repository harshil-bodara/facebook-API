import multer, { FileFilterCallback } from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig'; // Ensure correct import for your cloudinary config
import { Request, Response, NextFunction } from 'express';

// Define allowed file types
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

// File filter function with types
const fileFilter: multer.Options['fileFilter'] = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // No error, allow the file
  } else {
    const error = new Error('Only .jpeg, .jpg, .png files are allowed');
    cb(null, false); // Pass the error to the callback correctly
  }
};

interface UploadImageOptions {
  folderName: string;
  getPublicIdFn?: (req: Request, file: Express.Multer.File) => string;
}

const uploadImage = ({ folderName, getPublicIdFn }: UploadImageOptions) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      const defaultPublicId = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

      return {
        folder: folderName,
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: getPublicIdFn ? getPublicIdFn(req, file) : defaultPublicId,
        overwrite: true,
      };
    },
  });

  return multer({ storage,fileFilter:fileFilter }); // assuming multer is imported
};

export default uploadImage;

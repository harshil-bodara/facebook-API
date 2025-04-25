
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinaryConfig.js'; 

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpeg, .jpg, .png files are allowed'), false);
  }
};

const uploadImage = (folderName, getPublicIdFn = null) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const defaultPublicId = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`;

      return {
        folder: folderName,
        allowed_formats: ['jpg', 'jpeg', 'png'],
        public_id: getPublicIdFn ? getPublicIdFn(req, file) : defaultPublicId, 
        overwrite: true, 
      };
    },
  });

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, 
  });
};

export default uploadImage;

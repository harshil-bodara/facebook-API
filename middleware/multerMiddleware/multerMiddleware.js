const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
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
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;



// const storage = multer.diskStorage({
//   destination: function (req, File, cb) {
//     cb(null, path.join(__dirname,"/uploads"));
//   },
//   filename:function(req,file,cb){
//     const ext=path.extname(file.originalname);
//     cb(null,Date.now()+ext)
// }
// });
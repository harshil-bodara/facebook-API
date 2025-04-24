// middleware/setUploadFolder.js
const setUploadFolder = (folderGetter) => (req, res, next) => {
  req.uploadTarget = typeof folderGetter === "function" ? folderGetter(req) : folderGetter;
  next();
};

module.exports = setUploadFolder;

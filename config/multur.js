const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    if (file) {
      cb(null, Date.now() + "-" + file.originalname);
    }
    //path.extname get the uploaded file extension
  },
});

const multerFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
  console.log(file.originalname, req.body);

  const isExtensionValid = file.originalname.match(/\.(jpe?g|png|webp)$/i);
  const isMimeValid = allowedMimes.includes(file.mimetype);
  console.log(isExtensionValid, isMimeValid);

  if (!isExtensionValid || !isMimeValid) {
    return cb(new Error("Only PDF and image files are allowed!"), false);
  }
  cb(null, true);
};
exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

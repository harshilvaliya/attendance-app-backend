const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define storage paths
const USER_UPLOAD_PATH = "public/uploads";
const LEAVE_UPLOAD_PATH = "public/leaveUploads";

// Ensure directories exist
if (!fs.existsSync(USER_UPLOAD_PATH)) {
  fs.mkdirSync(USER_UPLOAD_PATH, { recursive: true });
}

if (!fs.existsSync(LEAVE_UPLOAD_PATH)) {
  fs.mkdirSync(LEAVE_UPLOAD_PATH, { recursive: true });
}

// Configure storage based on upload type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on route or field name
    if (
      req.originalUrl.includes("/leave-form") ||
      file.fieldname === "document"
    ) {
      cb(null, LEAVE_UPLOAD_PATH);
    } else {
      cb(null, USER_UPLOAD_PATH);
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalFileName = file.originalname;

    // Apply different naming conventions based on upload type
    if (
      req.originalUrl.includes("/leave-form") ||
      file.fieldname === "document"
    ) {
      cb(null, `leave_${timestamp}_${originalFileName}`);
    } else {
      cb(null, `user_${timestamp}_${originalFileName}`);
    }
  },
});

// File filter to validate uploads
const fileFilter = (req, file, cb) => {
  // For user profile images (selfie), only allow images
  if (file.fieldname === "selfie") {
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, PNG, and WebP images are allowed for profile pictures"
        ),
        false
      );
    }
  }
  // For leave form documents, allow both images and PDFs
  else if (file.fieldname === "document") {
    const allowedDocTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only JPG, PNG images and PDF documents are allowed"),
        false
      );
    }
  }
  // Default case for any other uploads
  else {
    cb(new Error("Unsupported file field"), false);
  }
};

// File size limits
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit for all uploads
};

// Create multer instances
const uploadSingle = multer({
  storage,
  fileFilter,
  limits,
}).single("selfie"); // For user registration

const uploadLeaveDoc = multer({
  storage,
  fileFilter,
  limits,
}).single("document"); // For leave form documents

// Export middleware functions
module.exports = {
  uploadUserImage: (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: "error",
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }
      next();
    });
  },

  uploadLeaveDocument: (req, res, next) => {
    uploadLeaveDoc(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          status: "error",
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      }
      next();
    });
  },
};

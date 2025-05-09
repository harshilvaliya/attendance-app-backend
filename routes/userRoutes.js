const express = require("express");
const router = express.Router();
// Remove the multer import
// const { upload } = require("../config/multer");
// Add the uploadMiddleware import
const {
  uploadUserImage,
  uploadLeaveDocument,
} = require("../config/uploadMiddleware");
const {
  addUser,
  getAllUser,
  deleteUser,
  editUser,
  getCurrentUser,
} = require("../controller/user/userController");
const { loginUser } = require("../controller/user/userLoginController");
const {
  createLeaveForm,
  getUserLeaveForms,
  getLeaveFormById,
  updateLeaveFormStatus,
  getAllLeaveForms,
  deleteLeaveForm,
} = require("../controller/user/leaveFormController");
const {
  addHoliday,
  getAllHolidays,
  deleteHoliday,
  editHoliday,
} = require("../controller/admin/adminHolidayController");
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Public routes
// Update to use uploadUserImage middleware
router.post("/register", addUser);
router.post("/login", loginUser);

// Protected user routes
router
  .get("/get-users", authMiddleware, getAllUser)
  .delete("/delete-user/:id", adminAuthMiddleware, deleteUser)
  .put("/edit-user/:id", authMiddleware, editUser)
  .get("/get-user", authMiddleware, getCurrentUser);

// Leave Form Routes
// Update to use uploadLeaveDocument middleware
router
  .post("/leave-form", authMiddleware, uploadLeaveDocument, createLeaveForm)
  .get("/leave-forms", authMiddleware, getUserLeaveForms)
  .get("/leave-form/:id", adminAuthMiddleware, getLeaveFormById)
  .put("/leave-form/:id/status", adminAuthMiddleware, updateLeaveFormStatus)
  .get("/all-leave-forms", adminAuthMiddleware, getAllLeaveForms)
  .delete("/leave-form/:id", adminAuthMiddleware, deleteLeaveForm);

// Holiday Routes (Admin Only)
router
  .post("/holiday", adminAuthMiddleware, addHoliday)
  .get("/holidays", authMiddleware, getAllHolidays)
  .delete("/holiday/:id", adminAuthMiddleware, deleteHoliday)
  .put("/holiday/:id", adminAuthMiddleware, editHoliday);

module.exports = router;

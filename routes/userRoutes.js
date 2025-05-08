const express = require("express");
const router = express.Router();
const { upload } = require("../config/multer");
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
router.post("/register", upload.single("selfie"), addUser);
router.post("/login", loginUser);

// Protected user routes
router
  .get("/get-users", authMiddleware, getAllUser)
  .delete("/delete-user/:id", authMiddleware, deleteUser)
  .put("/edit-user/:id", authMiddleware, editUser)
  .get("/get-user", authMiddleware, getCurrentUser);

// Leave Form Routes
router
  .post("/leave-form", authMiddleware, createLeaveForm)
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

const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUser,
  deleteUser,
  editUser,
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
const authMiddleware = require("../middleware/authMiddleware");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

// Public routes
router.post("/register", addUser);
router.post("/login", loginUser);

// Protected routes
router.get("/users", authMiddleware, getAllUser);
router.delete("/user/:id", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, editUser);

// Leave Form Routes
router.post("/leave-form", authMiddleware, createLeaveForm);
router.get("/leave-forms", adminAuthMiddleware, getUserLeaveForms);
router.get("/leave-form/:id", adminAuthMiddleware, getLeaveFormById);
router.put(
  "/leave-form/:id/status",
  adminAuthMiddleware,
  updateLeaveFormStatus
);
router.get("/all-leave-forms", adminAuthMiddleware, getAllLeaveForms);
router.delete("/leave-form/:id", adminAuthMiddleware, deleteLeaveForm);

module.exports = router;

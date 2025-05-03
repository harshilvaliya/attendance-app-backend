const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUser,
  deleteUser,
  editUser,
} = require("../controller/user/userController");
const { loginUser } = require("../controller/user/userLoginController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", addUser);
router.post("/login", loginUser);

// Protected routes
router.get("/users", authMiddleware, getAllUser);
router.delete("/user/:id", authMiddleware, deleteUser);
router.put("/user/:id", authMiddleware, editUser);

module.exports = router;

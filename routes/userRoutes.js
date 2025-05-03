const express = require("express");
const router = express.Router();
const {
  addUser,
  getAllUser,
  deleteUser,
  editUser,
} = require("../controller/user/userController");
const {
  loginUser,
  getLoginHistory,
} = require("../controller/user/userLoginController");

// User registration route
router.post("/register", addUser);

// Get all users route
router.get("/users", getAllUser);

// Delete user route
router.delete("/user/:id", deleteUser);

// Edit user route
router.put("/user/:id", editUser);

// Login routes
router.post("/login", loginUser);
router.get("/login-history", getLoginHistory);

module.exports = router;

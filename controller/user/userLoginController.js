const UserLogin = require("../../models/userLoginModel");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check if user is active
    if (user.deletedAt) {
      return res.status(401).json({
        status: "error",
        message: "Account is deactivated",
      });
    }

    // Update login timestamp
    user.LoginAt = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "eminem",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        lastLogin: user.LoginAt,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error during login",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
};

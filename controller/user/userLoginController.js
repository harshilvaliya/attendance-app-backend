const UserLogin = require("../../models/userLoginModel");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // Update login timestamp
    user.LoginAt = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET || "eminem", // In production, use environment variable
      { expiresIn: "24h" }
    );

    res.json({
      status: 200,
      message: "Login successful",
      details: {
        email: user.email,
        lastLogin: user.LoginAt,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);

    res.json({
      status: 500,
      message: "Error during login",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
};

const UserLogin = require("../../models/userLoginModel");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");

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

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        email: user.email,
        lastLogin: user.LoginAt,
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      status: "error",
      message: "Error during login",
      error: error.message,
    });
  }
};

const getLoginHistory = async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};

    const loginHistory = await UserLogin.find(query)
      .sort({ LoginAt: -1 })
      .select("email LoginAt");

    res.status(200).json({
      status: "success",
      data: loginHistory,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching login history",
      error: error.message,
    });
  }
};

module.exports = {
  loginUser,
  getLoginHistory,
};

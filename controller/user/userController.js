const User = require("../../models/userModel");

const addUser = async (req, res) => {
  try {
    const { username, phoneNumber, email, password, confirm_password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User with this email or phone number already exists",
      });
    }

    // Create new user
    const newUser = new User({
      username,
      phoneNumber,
      email,
      password,
      confirm_password,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error registering user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const query = {};
    const user = await User.find(query);

    res.json({
      status: 200,
      user,
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "Error fetching tags",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    await User.findByIdAndUpdate(id, { email });
    res.json({
      status: 200,
      message: "User edited successfully",
    });
  } catch (error) {
    res.json({
      status: 404,
      message: "Error editing user",
      error: error.message,
    });
  }
};

module.exports = {
  addUser,
  getAllUser,
  deleteUser,
  editUser
};

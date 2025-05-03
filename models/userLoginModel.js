const mongoose = require("mongoose");

const userLoginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  LoginAt: {
    type: Date,
    default: Date.now,
  },
});

const UserLogin = mongoose.model("UserLogin", userLoginSchema);

module.exports = UserLogin;

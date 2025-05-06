// const User = require("../../models/userModel");
// const bcrypt = require("bcryptjs");

// const addUser = async (req, res) => {
//   try {
//     const { username, phoneNumber, email, password, confirm_password } =
//       req.body;
//     // Validate required fields
//     if (!username || !phoneNumber || !email || !password || !confirm_password) {
//       return res.status(400).json({
//         status: "error",
//         message: "All fields are required",
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid email format",
//       });
//     }

//     // Validate phone number (10 digits)
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phoneNumber)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Phone number must be 10 digits",
//       });
//     }

//     // Validate username length
//     if (username.length < 3 || username.length > 30) {
//       return res.status(400).json({
//         status: "error",
//         message: "Username must be between 3 and 30 characters",
//       });
//     }

//     // Validate password strength
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         status: "error",
//         message:
//           "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//       });
//     }

//     // Validate password confirmation
//     if (password !== confirm_password) {
//       return res.status(400).json({
//         status: "error",
//         message: "Passwords do not match",
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({
//       $or: [{ email }, { phoneNumber }],
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         status: "error",
//         message: "User with this email or phone number already exists",
//       });
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     const newUser = new User({
//       username,
//       phoneNumber,
//       email,
//       password: hashedPassword,
//       confirm_password: hashedPassword,
//     });

//     await newUser.save();

//     res.status(201).json({
//       status: 201,
//       message: "User registered successfully",
//       data: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//         role: newUser.role,
//         phoneNumber: newUser.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Error registering user",
//       error: error.message,
//     });
//   }
// };

// const editUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { email, username, phoneNumber } = req.body;

//     // Validate if at least one field is provided
//     if (!email && !username && !phoneNumber) {
//       return res.status(400).json({
//         status: "error",
//         message:
//           "At least one field (email, username, or phoneNumber) is required",
//       });
//     }

//     // Validate email if provided
//     if (email) {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         return res.status(400).json({
//           status: "error",
//           message: "Invalid email format",
//         });
//       }
//     }

//     // Validate phone number if provided
//     if (phoneNumber) {
//       const phoneRegex = /^[0-9]{10}$/;
//       if (!phoneRegex.test(phoneNumber)) {
//         return res.status(400).json({
//           status: "error",
//           message: "Phone number must be 10 digits",
//         });
//       }
//     }

//     // Validate username if provided
//     if (username && (username.length < 3 || username.length > 30)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Username must be between 3 and 30 characters",
//       });
//     }

//     // Check if email or phone number already exists for another user
//     if (email || phoneNumber) {
//       const query = { _id: { $ne: id } };
//       if (email) query.email = email;
//       if (phoneNumber) query.phoneNumber = phoneNumber;

//       const existingUser = await User.findOne(query);
//       if (existingUser) {
//         return res.status(409).json({
//           status: "error",
//           message: "Email or phone number already in use by another user",
//         });
//       }
//     }

//     const updateData = {};
//     if (email) updateData.email = email;
//     if (username) updateData.username = username;
//     if (phoneNumber) updateData.phoneNumber = phoneNumber;

//     const updatedUser = await User.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     res.json({
//       status: 200,
//       message: "User updated successfully",
//       data: {
//         id: updatedUser._id,
//         username: updatedUser.username,
//         email: updatedUser.email,
//         phoneNumber: updatedUser.phoneNumber,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Error updating user",
//       error: error.message,
//     });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Validate ID format
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid user ID format",
//       });
//     }

//     const deletedUser = await User.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return res.status(404).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     res.json({
//       status: 200,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Error deleting user",
//       error: error.message,
//     });
//   }
// };

// const getAllUser = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;

//     // Validate pagination parameters
//     const pageNumber = parseInt(page);
//     const limitNumber = parseInt(limit);

//     if (isNaN(pageNumber) || pageNumber < 1) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid page number",
//       });
//     }

//     if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid limit number (must be between 1 and 100)",
//       });
//     }

//     const query = {};
//     if (search) {
//       query.$or = [
//         { username: { $regex: search, $options: "i" } },
//         { email: { $regex: search, $options: "i" } },
//         { phoneNumber: { $regex: search, $options: "i" } },
//       ];
//     }

//     const total = await User.countDocuments(query);
//     const users = await User.find(query)
//       .select("-password -confirm_password")
//       .skip((pageNumber - 1) * limitNumber)
//       .limit(limitNumber);

//     res.json({
//       status: 200,
//       data: {
//         users,
//         total,
//         page: pageNumber,
//         totalPages: Math.ceil(total / limitNumber),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Error fetching users",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   addUser,
//   getAllUser,
//   deleteUser,
//   editUser,
// };

const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const path = require("path");

const addUser = async (req, res) => {
  try {
    // Multer puts the file metadata on req.file
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Selfie image is required",
      });
    }

    const { username, phoneNumber, email, password, confirm_password } =
      req.body;
    // Validate required fields
    if (!username || !phoneNumber || !email || !password || !confirm_password) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required",
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

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        status: "error",
        message: "Phone number must be 10 digits",
      });
    }

    // Validate username length
    if (username.length < 3 || username.length > 30) {
      return res.status(400).json({
        status: "error",
        message: "Username must be between 3 and 30 characters",
      });
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        status: "error",
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    // Validate password confirmation
    if (password !== confirm_password) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

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

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Build selfie URL
    const selfieFilename = req.file.filename; // e.g. "1615565583571-selfie.png"
    const selfieUrl = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/${selfieFilename}`;

    // Create new user
    const newUser = new User({
      username,
      phoneNumber,
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      selfieUrl,
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
        selfieUrl: newUser.selfieUrl,
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

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username, phoneNumber } = req.body;

    // Validate if at least one field is provided
    if (!email && !username && !phoneNumber) {
      return res.status(400).json({
        status: "error",
        message:
          "At least one field (email, username, or phoneNumber) is required",
      });
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid email format",
        });
      }
    }

    // Validate phone number if provided
    if (phoneNumber) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          status: "error",
          message: "Phone number must be 10 digits",
        });
      }
    }

    // Validate username if provided
    if (username && (username.length < 3 || username.length > 30)) {
      return res.status(400).json({
        status: "error",
        message: "Username must be between 3 and 30 characters",
      });
    }

    // Check if email or phone number already exists for another user
    if (email || phoneNumber) {
      const query = { _id: { $ne: id } };
      if (email) query.email = email;
      if (phoneNumber) query.phoneNumber = phoneNumber;

      const existingUser = await User.findOne(query);
      if (existingUser) {
        return res.status(409).json({
          status: "error",
          message: "Email or phone number already in use by another user",
        });
      }
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Validate pagination parameters
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({
        status: "error",
        message: "Invalid page number",
      });
    }

    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100) {
      return res.status(400).json({
        status: "error",
        message: "Invalid limit number (must be between 1 and 100)",
      });
    }

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password -confirm_password")
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      status: 200,
      data: {
        users,
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching users",
      error: error.message,
    });
  }
};

module.exports = {
  addUser,
  getAllUser,
  deleteUser,
  editUser,
};

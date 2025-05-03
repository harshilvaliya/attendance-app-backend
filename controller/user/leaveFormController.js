const LeaveForm = require("../../models/leaveFormModel");
const User = require("../../models/userModel");

// Create a new leave form
exports.createLeaveForm = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason, document } = req.body;
    const userId = req.user._id; // Assuming user is authenticated and user ID is available in req.user

    // Validate dates
    if (new Date(fromDate) > new Date(toDate)) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be after to date",
      });
    }

    const leaveForm = new LeaveForm({
      user: userId,
      leaveType,
      fromDate,
      toDate,
      reason,
      document,
    });

    await leaveForm.save();

    res.status(201).json({
      success: true,
      message: "Leave form submitted successfully",
      data: leaveForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating leave form",
      error: error.message,
    });
  }
};

// Get all leave forms for a user
exports.getUserLeaveForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const leaveForms = await LeaveForm.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: leaveForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave forms",
      error: error.message,
    });
  }
};

// Get a single leave form by ID
exports.getLeaveFormById = async (req, res) => {
  try {
    const leaveForm = await LeaveForm.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!leaveForm) {
      return res.status(404).json({
        success: false,
        message: "Leave form not found",
      });
    }

    res.status(200).json({
      success: true,
      data: leaveForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave form",
      error: error.message,
    });
  }
};

// Update leave form status (for admin/manager)
exports.updateLeaveFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const leaveForm = await LeaveForm.findById(req.params.id);

    if (!leaveForm) {
      return res.status(404).json({
        success: false,
        message: "Leave form not found",
      });
    }

    leaveForm.status = status;
    await leaveForm.save();

    res.status(200).json({
      success: true,
      message: "Leave form status updated successfully",
      data: leaveForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating leave form status",
      error: error.message,
    });
  }
};

// Get all leave forms (for admin/manager)
exports.getAllLeaveForms = async (req, res) => {
  try {
    const leaveForms = await LeaveForm.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: leaveForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all leave forms",
      error: error.message,
    });
  }
};

// Delete a leave form
exports.deleteLeaveForm = async (req, res) => {
  try {
    const leaveForm = await LeaveForm.findById(req.params.id);

    if (!leaveForm) {
      return res.status(404).json({
        success: false,
        message: "Leave form not found",
      });
    }

    // Check if the user is authorized to delete this leave form
    if (leaveForm.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this leave form",
      });
    }

    await leaveForm.remove();

    res.status(200).json({
      success: true,
      message: "Leave form deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting leave form",
      error: error.message,
    });
  }
};

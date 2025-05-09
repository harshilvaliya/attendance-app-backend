// Replace multer import with the uploadMiddleware import
const LeaveForm = require("../../models/leaveFormModel");

// Remove the upload.single("document") middleware from the array
// and convert to a regular async function
const createLeaveForm = async (req, res) => {
  try {
    const { leaveType, fromDate, toDate, reason } = req.body;
    const userId = req.user._id;

    if (!leaveType || !fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: leaveType, fromDate, toDate, and reason",
      });
    }

    const validLeaveTypes = [
      "Annual",
      "Sick",
      "Maternity",
      "Paternity",
      "Unpaid",
      "Other",
    ];
    if (!validLeaveTypes.includes(leaveType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid leave type. Must be one of: Annual, Sick, Maternity, Paternity, Unpaid, Other",
      });
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const currentDate = new Date();

    if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format" });
    }

    if (fromDateObj > toDateObj) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be after to date",
      });
    }

    if (fromDateObj < currentDate) {
      return res.status(400).json({
        success: false,
        message: "Leave cannot be applied for past dates",
      });
    }

    if (reason.length < 10 || reason.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Reason must be between 10 and 500 characters",
      });
    }

    const leaveForm = new LeaveForm({
      user: userId,
      leaveType,
      fromDate: fromDateObj,
      toDate: toDateObj,
      reason,
      // Update the document path to match the new format from uploadMiddleware
      document: req.file ? `/leaveUploads/${req.file.filename}` : null,
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

const updateLeaveFormStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Approved", "Rejected"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: Pending, Approved, Rejected",
      });
    }

    const leaveForm = await LeaveForm.findById(req.params.id);
    if (!leaveForm) {
      return res
        .status(404)
        .json({ success: false, message: "Leave form not found" });
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

const getLeaveFormById = async (req, res) => {
  try {
    const leaveForm = await LeaveForm.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!leaveForm) {
      return res
        .status(404)
        .json({ success: false, message: "Leave form not found" });
    }
    res.status(200).json({ success: true, data: leaveForm });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave form",
      error: error.message,
    });
  }
};

const getUserLeaveForms = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      search,
      sortBy = "createdAt",
      order = "desc",
      status,
      leaveType,
    } = req.query;

    const query = { user: userId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by leave type if provided
    if (leaveType) {
      query.leaveType = leaveType;
    }

    // Search in reason field if search parameter is provided
    if (search) {
      query.reason = new RegExp(search, "i");
    }

    // Count total leave forms matching the query
    const totalLeaveForms = await LeaveForm.countDocuments(query);

    // Get leave forms with sorting
    const leaveForms = await LeaveForm.find(query)
      .sort({ [sortBy]: order === "desc" ? 1 : -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: leaveForms,
      totalLeaveForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching leave forms",
      error: error.message,
    });
  }
};

const getAllLeaveForms = async (req, res) => {
  try {
    const {
      search,
      sortBy = "createdAt",
      order = "desc",
      status,
      leaveType,
      fromDate,
      toDate,
    } = req.query;

    const query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by leave type if provided
    if (leaveType) {
      query.leaveType = leaveType;
    }

    // Filter by date range if provided
    if (fromDate || toDate) {
      query.fromDate = {};
      if (fromDate) {
        query.fromDate.$gte = new Date(fromDate);
      }
      if (toDate) {
        query.toDate = {};
        query.toDate.$lte = new Date(toDate);
      }
    }

    // Search in reason field if search parameter is provided
    if (search) {
      query.reason = new RegExp(search, "i");
    }

    // Count total leave forms matching the query
    const totalLeaveForms = await LeaveForm.countDocuments(query);

    // Get leave forms with sorting
    const leaveForms = await LeaveForm.find(query)
      .sort({ [sortBy]: order === "desc" ? 1 : -1 })
      .populate("user", "name email");

    res.status(200).json({
      success: true,
      data: leaveForms,
      totalLeaveForms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all leave forms",
      error: error.message,
    });
  }
};

const deleteLeaveForm = async (req, res) => {
  try {
    const leaveForm = await LeaveForm.findById(req.params.id);
    if (!leaveForm) {
      return res
        .status(404)
        .json({ success: false, message: "Leave form not found" });
    }
    if (leaveForm.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this leave form",
      });
    }
    await leaveForm.remove();
    res
      .status(200)
      .json({ success: true, message: "Leave form deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting leave form",
      error: error.message,
    });
  }
};

module.exports = {
  createLeaveForm,
  updateLeaveFormStatus,
  getUserLeaveForms,
  getLeaveFormById,
  getAllLeaveForms,
  deleteLeaveForm,
};

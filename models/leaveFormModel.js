const mongoose = require("mongoose");

const leaveFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  leaveType: {
    type: String,
    required: true,
    enum: ["Annual", "Sick", "Maternity", "Paternity", "Unpaid", "Other"],
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  document: {
    type: String, // This will store the path to the uploaded file
    required: false,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LeaveForm = mongoose.model("LeaveForm", leaveFormSchema);

module.exports = LeaveForm;

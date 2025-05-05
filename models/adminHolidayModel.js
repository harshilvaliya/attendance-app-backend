const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Holiday name is required"],
  },
  // For single date
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  // For date range (optional - only used if it's a range)
  endDate: {
    type: Date,
    default: null,
  },
  isDateRange: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    required: [true, "Holiday type is required"],
    enum: ["National", "Religious", "Regional", "Corporate", "Other"],
    default: "Other",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Holiday = mongoose.model("Holiday", holidaySchema);

module.exports = Holiday;

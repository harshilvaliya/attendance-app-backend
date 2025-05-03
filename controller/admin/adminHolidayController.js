const Holiday = require("../../models/adminHolidayModel");

// Add a new holiday
const addHoliday = async (req, res) => {
  try {
    const { name, startDate, endDate, isDateRange, type } = req.body;

    // Create new holiday
    const newHoliday = new Holiday({
      name,
      startDate,
      endDate: endDate || null,
      isDateRange: isDateRange || false,
      type,
    });

    await newHoliday.save();

    res.json({
      status: 201,
      message: "Holiday added successfully",
      data: newHoliday,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Error adding holiday",
      error: error.message,
    });
  }
};

// Get all holidays
const getAllHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();

    res.json({
      status: 200,
      holidays,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Error fetching holidays",
      error: error.message,
    });
  }
};

// Delete a holiday
const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    await Holiday.findByIdAndDelete(id);

    res.json({
      status: 200,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Error deleting holiday",
      error: error.message,
    });
  }
};

// Edit a holiday
const editHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, isDateRange, type } = req.body;

    const updatedHoliday = await Holiday.findByIdAndUpdate(
      id,
      {
        name,
        startDate,
        endDate,
        isDateRange,
        type,
      },
      { new: true, runValidators: true }
    );

    if (!updatedHoliday) {
      return res.json({
        status: "error",
        message: "Holiday not found",
      });
    }

    res.json({
      status: 200,
      message: "Holiday updated successfully",
      data: updatedHoliday,
    });
  } catch (error) {
    res.json({
      status: "error",
      message: "Error updating holiday",
      error: error.message,
    });
  }
};

module.exports = {
  addHoliday,
  getAllHolidays,
  deleteHoliday,
  editHoliday,
};

const Holiday = require("../../models/adminHolidayModel");

// Add a new holiday
const addHoliday = async (req, res) => {
  try {
    const { name, startDate, endDate, isDateRange, type } = req.body;

    // Validate required fields
    if (!name || !startDate || !type) {
      return res.status(400).json({
        status: "error",
        message: "Name, start date, and type are required",
      });
    }

    // Validate name length
    if (name.length < 3 || name.length > 50) {
      return res.status(400).json({
        status: "error",
        message: "Holiday name must be between 3 and 50 characters",
      });
    }

    // Parse and validate dates
    let startDateObj, endDateObj;
    try {
      startDateObj = new Date(startDate);
      if (isNaN(startDateObj.getTime())) {
        return res.status(400).json({
          status: "error",
          message: "Invalid start date format. Use YYYY-MM-DD format",
        });
      }

      if (endDate) {
        endDateObj = new Date(endDate);
        if (isNaN(endDateObj.getTime())) {
          return res.status(400).json({
            status: "error",
            message: "Invalid end date format. Use YYYY-MM-DD format",
          });
        }

        // Set time to start of day for comparison
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj.setHours(0, 0, 0, 0);

        if (endDateObj < startDateObj) {
          return res.status(400).json({
            status: "error",
            message: "End date must be after or equal to start date",
          });
        }
      }
    } catch (error) {
      return res.status(400).json({
        status: "error",
        message: "Invalid date format. Use YYYY-MM-DD format",
      });
    }

    // Validate holiday type
    const validTypes = [
      "National",
      "Religious",
      "Regional",
      "Corporate",
      "Other",
    ];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid holiday type. Must be one of: ${validTypes.join(
          ", "
        )}`,
      });
    }

    // Create new holiday
    const newHoliday = new Holiday({
      name,
      startDate: startDateObj,
      endDate: endDateObj || null,
      isDateRange: Boolean(isDateRange),
      type,
    });

    await newHoliday.save();

    res.status(201).json({
      status: "success",
      message: "Holiday added successfully",
      data: newHoliday,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error adding holiday",
      error: error.message,
    });
  }
};

// Get all holidays with sorting and filtering
const getAllHolidays = async (req, res) => {
  try {
    const { search, sortBy = "startDate", order = "asc", type } = req.query;

    const query = {};

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Search by name if search parameter is provided
    if (search) {
      query.name = new RegExp(search, "i");
    }

    // Count total holidays matching the query
    const totalHolidays = await Holiday.countDocuments(query);

    // Always sort by sortBy and order, defaulting to startDate ascending
    const sortField = sortBy || "startDate";
    const sortOrder = order === "asc" ? -1 : 1;
    const holidays = await Holiday.find(query).sort({ [sortField]: sortOrder });

    res.status(200).json({
      status: "success",
      data: holidays,
      totalHolidays,
    });
  } catch (error) {
    res.status(500).json({
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

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid holiday ID format",
      });
    }

    const deletedHoliday = await Holiday.findByIdAndDelete(id);

    if (!deletedHoliday) {
      return res.status(404).json({
        status: "error",
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
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

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid holiday ID format",
      });
    }

    // Validate at least one field is provided
    if (!name && !startDate && !endDate && isDateRange === undefined && !type) {
      return res.status(400).json({
        status: "error",
        message: "At least one field must be provided for update",
      });
    }

    // Validate name if provided
    if (name && (name.length < 3 || name.length > 50)) {
      return res.status(400).json({
        status: "error",
        message: "Holiday name must be between 3 and 50 characters",
      });
    }

    // Prepare update object
    const updateData = {};

    // Handle name update
    if (name) updateData.name = name;

    // Handle type update
    if (type) {
      const validTypes = [
        "National",
        "Religious",
        "Regional",
        "Corporate",
        "Other",
      ];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          status: "error",
          message: `Invalid holiday type. Must be one of: ${validTypes.join(
            ", "
          )}`,
        });
      }
      updateData.type = type;
    }

    // Handle date updates
    if (startDate || endDate) {
      // Get existing holiday data for date comparison
      const existingHoliday = await Holiday.findById(id);
      if (!existingHoliday) {
        return res.status(404).json({
          status: "error",
          message: "Holiday not found",
        });
      }

      // Parse dates
      let startDateObj = startDate
        ? new Date(startDate + "T00:00:00Z") // Explicitly set to UTC
        : existingHoliday.startDate;

      let endDateObj = endDate
        ? new Date(endDate + "T00:00:00Z") // Explicitly set to UTC
        : existingHoliday.endDate;
      // Set time to start of day for proper comparison
      startDateObj.setUTCHours(0, 0, 0, 0);
      if (endDateObj) endDateObj.setUTCHours(0, 0, 0, 0);
      console.log(endDateObj && startDateObj > endDateObj, "compare");

      // Compare dates if both exist
      if (endDateObj && startDateObj > endDateObj) {
        console.log("compare");
        return res.status(400).json({
          status: "error",
          message: "End date must be on or after start date",
        });
      }

      // Update the dates
      updateData.startDate = new Date(startDate);
      if (endDate !== undefined) updateData.endDate = new Date(endDate) || null;
    }

    // Handle isDateRange update
    if (isDateRange !== undefined) {
      updateData.isDateRange = Boolean(isDateRange);
    }
    console.log(updateData, "updateData");

    // Update the holiday
    const updatedHoliday = await Holiday.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedHoliday) {
      return res.status(404).json({
        status: "error",
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Holiday updated successfully",
      data: updatedHoliday,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
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

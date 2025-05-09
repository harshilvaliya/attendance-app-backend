const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || 5000;

// Middleware
app
  .use("/public", express.static(path.join(__dirname, "public")))
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

// Routes
app.use("/user", userRoutes).use("/admin", userRoutes);

// Database connection and server start
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

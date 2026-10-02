const cors = require("cors");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Configure DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// CORS configuration (supports configurable frontend origin in production)
const corsOptions = {
  origin: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
    : true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoutes");
const companyRoutes = require("./routes/companyRoutes");
const leadRoutes = require("./routes/leadRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Mini CRM API running",
    status: "healthy",
    version: "1.0.0",
  });
});

// Database connection
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
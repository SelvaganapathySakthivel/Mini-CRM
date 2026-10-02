const cors = require("cors");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    // Ignore in unsupported environments
  }
}

const app = express();

// Full open CORS for API access
app.use(cors());
app.use(express.json());

// Serverless MongoDB connection handler
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing in environment variables!");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
};

// Connect DB middleware for requests
app.use(async (req, res, next) => {
  if (req.method !== "OPTIONS") {
    await connectDB();
  }
  next();
});

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    message: "Mini CRM API running",
    status: "healthy",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Mini CRM API /api endpoint running",
    status: "healthy",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

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

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
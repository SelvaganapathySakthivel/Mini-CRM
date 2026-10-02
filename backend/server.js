const cors = require("cors");
const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Configure custom DNS only in local development if needed
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    // Ignore in environments where setting DNS is restricted
  }
}

const app = express();

// CORS configuration (allow requests from frontend)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
app.use(express.json());

// Serverless MongoDB connection caching
let cachedPromise = null;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set in Environment Variables");
  }
  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }
  try {
    await cachedPromise;
  } catch (err) {
    cachedPromise = null;
    throw err;
  }
};

// Health check endpoint (does not require DB)
app.get("/", (req, res) => {
  res.json({
    message: "Mini CRM API running",
    status: "healthy",
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    version: "1.0.0",
  });
});

// Middleware to ensure DB connection before executing API routes
app.use(async (req, res, next) => {
  // Skip DB check for root / preflight options
  if (req.path === "/" || req.method === "OPTIONS") {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    return res.status(500).json({
      message: "Database connection failed. Please ensure MONGO_URI is set in Vercel and MongoDB Atlas IP whitelist is 0.0.0.0/0.",
      error: error.message,
    });
  }
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
  connectDB()
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
    });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const listRoutes = require("./routes/listRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/lists", listRoutes);
app.use("/api", itemRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start
const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();

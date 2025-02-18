const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const cors = require("cors");

// Load environment variables
require("dotenv").config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Community Health Dashboard API");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/data", require("./routes/data"));
app.use("/api/analyze", require("./routes/analyze"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

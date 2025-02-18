// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the "uploads" folder exists
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/csv", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the file path to be used by the Python script.
  // You might want to return a relative path or an absolute path depending on your setup.
  const filePath = path.join("uploads", req.file.filename);
  res.json({ filePath });
});

module.exports = router;

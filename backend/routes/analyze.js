// routes/analyze.js
const express = require("express");
const router = express.Router();
const runPythonScript = require("../utils/pythonRunner");

router.post("/", async (req, res, next) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ msg: "CSV file path is required" });
    }
    // Execute the Python script with the file path argument
    const result = await runPythonScript("python/csv_processor.py", [filePath]);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const runPythonScript = require("../utils/pythonRunner");

router.post("/", async (req, res, next) => {
  try {
    const { filePath, cleaningOptions, filters } = req.body;

    // Convert the cleaningOptions and filters objects to JSON strings
    const cleaningOptionsJSON = JSON.stringify(cleaningOptions || {});
    const filtersJSON = JSON.stringify(filters || {});

    // Pass the filePath and the JSON strings as arguments to the Python script
    const result = await runPythonScript("python/csv_processor.py", [
      filePath,
      cleaningOptionsJSON,
      filtersJSON,
    ]);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

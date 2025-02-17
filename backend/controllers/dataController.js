const runPythonScript = require("../utils/pythonRunner");

exports.analyzeCSV = async (req, res, next) => {
  try {
    const { filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ msg: "CSV file path is required" });
    }

    // Call the csv_processor.py script w/ the file path
    const result = await runPythonScript("python/csv_processor.py", [filePath]);

    // Assume python script returns JSON data via stdout
    res.json({ analysis: result });
  } catch (error) {
    next(error);
  }
};

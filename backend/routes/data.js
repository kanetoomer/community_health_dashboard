const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

// POST /api/data/analyze
router.post("/analyze", dataController.analyzeCSV);

module.exports = router;

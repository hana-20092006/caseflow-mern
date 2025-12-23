const express = require("express");
const router = express.Router();
const Case = require("../models/Case");

// CREATE a case
router.post("/", async (req, res) => {
  try {
    const newCase = await Case.create(req.body);
    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all cases
router.get("/", async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
});

// UPDATE case status
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };

    // auto set solved time
    if (status === "Solved") {
      updateData.solvedAt = new Date();
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DASHBOARD stats
router.get("/stats/summary", async (req, res) => {
  try {
    const total = await Case.countDocuments();
    const pending = await Case.countDocuments({ status: "Pending" });
    const inProgress = await Case.countDocuments({ status: "In Progress" });
    const solved = await Case.countDocuments({ status: "Solved" });

    res.json({
      total,
      pending,
      inProgress,
      solved,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
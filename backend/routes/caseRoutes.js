const express = require("express");
const router = express.Router();
const Case = require("../models/Case");

// CREATE a case
router.post("/", async (req, res) => {
  try {
    const newCase = await Case.create({
  ...req.body,
  statusHistory: [
    {
      status: "Pending",
    },
  ],
});

    res.status(201).json(newCase);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET all cases
// GET cases with search & filters
router.get("/", async (req, res) => {
  try {
    const { search, status, law, fromDate, toDate, slaBreached } = req.query;

    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by law section
    if (law) {
      query.lawSection = law;
    }

    // Date range filter
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    // SLA breached (> 7 days)
    if (slaBreached === "true") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      query.status = "Solved";
      query.solvedAt = { $lt: sevenDaysAgo };
    }

    const cases = await Case.find(query).sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// UPDATE case status
const auth = require("../middleware/auth");
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "official") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const { status } = req.body;

    const updateData = {
      status,
      $push: {
        statusHistory: {
          status,
          changedAt: new Date(),
        },
      },
    };

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
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const caseRoutes = require("./routes/caseRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/cases", caseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("CaseFlow Backend is running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

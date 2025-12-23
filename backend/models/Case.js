const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Solved"],
      default: "Pending",
    },

    lawSection: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    solvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Case", caseSchema);

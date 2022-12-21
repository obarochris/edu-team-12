const mongoose = require("mongoose");
const validator = require("validator");

const annoucementSchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: [50, "Name should be under 20 characters"],
  },
  description: {
    type: String,
    maxLength: [100, "Name should be under 100 characters"],
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  Class: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Announcement", annoucementSchema);

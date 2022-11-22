const mongoose = require("mongoose");
const validator = require("validator");
const registrationSchema = mongoose.Schema({
  registration_number: {
    type: String,
    required: [true, "Please provide Registration number"],
    maxLength: [20, "Name should be under 20 characters"],
    unique: true,
  },
  role: {
    type: [String],
    required: [true, "Please enter user's role"],
    enum: {
      values: ["Student", "Teacher", "Parent"],
      message: "Please select correct option for role.",
    },
  },
});

module.exports = mongoose.model("Registration", registrationSchema);

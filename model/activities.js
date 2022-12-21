const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require('slugify');

const activitySchema = mongoose.Schema({
  title: {
    type: String,
    maxLength: [50, "Name should be under 20 characters"],
    required: [true, "Please provide title of activity"],
  },
  description: {
    type: String,
    required: [true, "Please provide the description of activity"],
  },
  status: {
    type: String,
    required: [true, "Please select category from options"],
    enum: ["pending", "attempted", "completed"],
    default: "pending",
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    // required: true,
  },
  Class: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//creating activities slug before saving
activitySchema.pre('save', function (next) {
    this.slug = slugify(this.title, {lower: true})

    next();
}); 

module.exports = mongoose.model("Activity", activitySchema);
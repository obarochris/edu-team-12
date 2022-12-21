const mongoose = require("mongoose");
const validator = require("validator");
const customError = require("../utils/customError");

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: [true, "Please provide the name of the class"],
    maxLength: [20, "Name should be under 20 characters"],
    // unique: true,
  },
  classYear: {
    type: String,
    required: [true, "Please provide the year of class"],
    // unique: true,
  },

  numberOfStudents: {
    type: String,
  },
  users: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
activity:[
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
     activityStatus: {
      type: String,
      default: "Pending",
     },
     user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  }
],
  announcement: {
    type: mongoose.Schema.ObjectId,
    ref: "Announcement",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

classSchema.statics.doesClassExist = async function (className, classYear) {
  try {
    const Class = await this.findOne({ className, classYear });
    if (Class) return false;
    return true;
  } catch (error) {
    console.log("error inside doesClassExist method", error.message);
    return false;
  }
};

classSchema.statics.doesUserExist = async function (userId) {
  try {
    const user = await this.findOne({ userId });
    if (user) return false;
    return true;
  } catch (error) {
    console.log("Error inside doesUserExist method", error.message);
  }
};

module.exports = mongoose.model("Class", classSchema);

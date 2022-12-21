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
      values: ["student", "teacher", "parent"],
      message: "Please select correct option for role.",
    },
  },
});

//check if registration number exist
registrationSchema.statics.doesRegNoExist = async function (registration_number) {
  try {
    const regId = await this.findOne({registration_number });
    if (!regId) return false;
    return true;
  } catch (error) {
    console.log("error inside doesClassExist method", error.message);
    return false;
  }
};
module.exports = mongoose.model("Registration", registrationSchema);

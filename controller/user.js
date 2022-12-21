const User = require("../model/user");
const customError = require("../utils/customError");
const bigPromise = require("../middleware/bigPromise");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const Registration = require("../model/registration");
const Class = require("../model/class");

// Creating a new account
exports.createAccount = bigPromise(async (req, res, next) => {
  const {
    registration_id,
    email,
    firstName,
    lastName,
    middleName,
    password,
    role,
    gender,
    address
  } = req.body;

  if (
    !(
      registration_id ||
      email ||
      firstName ||
      lastName ||
      middleName ||
      password || gender || address
    )
  ) {
    return next(
      new customError(
        "registration_id, Email, firstName, lastName, middleName, StudClass, gender, address and password are required",
        400
      )
    );
  }

  //check if registration number exist in the registration database
  const isRegNo = await Registration.doesRegNoExist(registration_id);

  if (!isRegNo) {
    return next(new customError("Registration Number does not exist", 401));
  }

  //check if registration number has already been used
  const regNoInUse = await User.findOne({ registration_id: registration_id });
  if (regNoInUse) {
    return next(new customError("Registration number is already in use", 401));
  }
 
  //handles file
  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "gads",
    width: 150,
    crop: "scale",
  });

  //create user
  const user = await User.create({
    registration_id,
    firstName,
    lastName,
    middleName,
    email,
    password,
    role,
    gender,
    address,

    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

// Login to account
exports.login = bigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  //check if email or password was entered
  if (!(email || password)) {
    return next(new customError("Please provide email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  //if user is not found in the database
  if (!user) {
    return next(
      new customError("Email or password does not match or exist", 400)
    );
  }

  //match password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  //if password do not match
  if (!isPasswordCorrect) {
    return next(
      new customError("Email or password does not match or exist", 400)
    );
  }

  //if all goes good, we send the token
  cookieToken(user, res);
});

// Get all Teachers
exports.getAllTeacher = bigPromise(async (req, res, next) => {
  const users = await User.find({ role: "teacher" });
  const count = users.length;

  res.status(200).json({
    success: true,
    count,
    users,
  });
});
// Get all Students
exports.getAllStudents = bigPromise(async (req, res, next) => {
  const users = await User.find({ role: "student" });
  const count = users.length;

  res.status(200).json({
    success: true,
    count,
    users,
  });
});

// Get all user
exports.adminGetAllUsers = bigPromise(async(req, res, next) =>{
  const users = await User.find();

  const counter = users.length;
  res.status(200).json({
    success: true,
    count: counter, 
    users
  });
});

exports.adminGetOnlyAdmin = bigPromise(async(req, res, next) =>{
  const users = await User.find({role: "admin"});
 const count = users.length;
  // const counter = await User.count();
  res.status(200).json({
    success: true,
    count, 
    users
  });
});

// Update user
exports.updateUser = bigPromise(async (req, res, next) => {
  const newData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName,
    email: req.body.email,
  };

  if (req.files) {
    // find user
    const user = await User.findById(req.user.id);

    //find image id for user
    const imageId = user.photo.id;

    //delete photo on cloudinary
    await cloudinary.v2.uploader.destroy(imageId);

    //upload new photo
    const result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "gads",
        width: 150,
        crop: "scale",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }
  //update user
  const user = await User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    // user
  });
});

// delete user
exports.deleteUser = bigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new customError("User not found", 401));
  }

  const imageId = user.photo.id;
  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
  });
});



const User = require("../model/user");
const customError = require("../utils/customError");
const bigPromise = require("../middleware/bigPromise");
const cookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const Registration = require("../model/registration");


exports.createAccount = bigPromise(async (req, res, next) => {
  const {
    registration_id,
    email,
    firstName,
    lastName,
    middleName,
    password,
    role
  } = req.body;

  

  if (!(registration_id || email || firstName || lastName || middleName || password)) {
    return next(
      new customError(
        "registration_id, Email, firstName, lastName, middleName, StudClass and password are required",400
      )
    );
  }
  //handles file
  let file = req.files.photo;
  const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "gads",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    registration_id,
    firstName,
    lastName,
    middleName,
    email,
    password,
    role,

    photo: {
      id: result.public_id, 
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

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

exports.getUsers = bigPromise(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

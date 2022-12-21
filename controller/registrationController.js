const Registration = require("../model/registration");
const customError = require("../utils/customError");
const bigPromise = require("../middleware/bigPromise");

exports.createID = bigPromise(async (req, res, next) => {
  const { registration_number, role } = req.body;

  if (!(registration_number || role)) {
    return next(
      new customError("registration_number, name and role are required", 401)
    );
  }

  const registration = await Registration.create(req.body);
  res.status(200).json({
    success: true,
    message: "Register Successfully.",
    data: registration,
  });
});

exports.viewIds = bigPromise(async (req, res, next) => {
  const registration_number = await Registration.find();

  res.status(200).json({
    success: true,
    registration_number,
  });
});

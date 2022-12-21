const bigPromise = require("../middleware/bigPromise");
const activity = require("../model/activities");
const customError = require("../utils/customError");
const Class = require('../model/class')

exports.createActivity = bigPromise(async (req, res, next) => {
  const { title, description, status, classId } = req.body;

  if (!(title || description || status)) {
    return next(
      new customError("title, description, and status is required"),
      401
    );
  }
  //find class to push activities to
  const classActivity = await Class.findById(classId);
  if (!classActivity) {
    return next(new customError("Class does not exist", 400));
  }

  await classActivity.users.push(description, title)
 console.log(activity);
  // await activity.save({ validateBeforeSave: false })
  // const Activity = await activity.create({
  //   title,
  //   description,
  //   status,
  //   Class,
  // });

  res.status(200).json({
    success: true,
    message: "Activity Created succesfuly",
    classActivity,
    // users,
  });
});

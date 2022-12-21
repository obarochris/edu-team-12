const bigPromise = require("../middleware/bigPromise");
const Class = require("../model/class");
const user = require("../model/user");
const Activity = require("../model/activities");
const customError = require("../utils/customError");

exports.createClass = bigPromise(async (req, res, next) => {
  const { className, classYear } = req.body;

  if (!(className && classYear)) {
    return next(new customError(" name and class year are required", 400));
  }

  //check whether class already exist
  const isNewClass = await Class.doesClassExist(className, classYear);

  if (!isNewClass) {
    //  return res.json({
    //   success: false,
    //   message: "This class already exists"
    //  })
    return next(new customError("This class already exists", 401));
  }

  const classes = await Class({
    className,
    classYear,
  });

  await classes.save();

  res.status(200).json({
    success: true,
    classes,
  });
});

exports.addActivity = bigPromise(async (req, res, next) => {
  const { classId, activityId } = req.body;

  const addActivity = {
    // activity: req.activity._id,
    // status: req.activity.status

  }
  const activityClass = await Class.findById(classId);
  if (!activityClass) {
    return next(new customError("Class does not exist", 400));
  }

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new customError("Activity does not exist ", 401));
  } 

  const users = await activityClass.users.push("Wale")
  console.log(users);

  
  await activityClass.save({validateBeforeSave: false})
  
  res.status(200).json({
    success: true,
    users
  });
});

exports.addAnnoucement = bigPromise(async (req, res, next) => {
  const annoucement = ({
    title,
    details = [description, startDate, endDate],
    classId,
  } = req.body);

  if (!(title || details)) {
    return next(new customError("title and details are required", 400));
  }

  //find class to push activities to
  const annoucements = await Class.findById(classId);

  annoucements.annoucement.push(annoucement);

  //save
  await annoucements.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    annoucement,
  });
});

// Add user to class
exports.joinClass = bigPromise(async (req, res, next) => {
  const { classId } = req.body;

  if (!classId) {
    return next(new customError("ClassId is required", 401));
  }
  const addUser = {
    user: req.user._id,
    name:
      req.user.firstName + " " + req.user.lastName + " " + req.user.middleName,
  };

  //find class to add user
  const classUpdate = await Class.findById(classId);

  if (!classUpdate) {
    return next(new customError("Class does not exist", 400));
  }

  //check if userhas been added
  const userAlreadyAdded = classUpdate.users.find(
    (stud) => stud.user.toString() === req.user._id.toString()
  );

  if (userAlreadyAdded) {
    return next(new customError("You are already in this class", 401));
  }

  classUpdate.users.push(addUser);

  await classUpdate.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    classUpdate,
  });
});

exports.deleteUserFromClass = bigPromise(async (req, res, next) => {
  const { classId, userId } = req.body;
  const user = {
    user: req.user._id,
    name: req.user.name,
  };

  //check if class exists
  const classDetails = await Class.findById(classId);

  if (!classDetails) {
    return next(new customError("Class does not exist", 400));
  }

  //check if logged in user exist in class
  const userExists = await classDetails.users.find(
    (stud) => stud.user.toString() === req.user._id.toString()
  );
  // console.log(userExists);

  if (!userExists) {
    return next(new customError("User does not exist", 400));
  }

  // remove user
  await userExists.remove();

  // update class
  classDetails.save();

  res.status(200).json({
    success: true,
  });
});

exports.adminDeleteUser = bigPromise(async (req, res, next) => {
  const { classId, userId } = req.body;

  //check if class exist
  const userClass = await Class.findById(classId);
  if (!userClass) {
    return next(new customError("Class does not exist", 400));
  }

  //check if user exists in class
  const user = await userClass.users.find(
    (user) => user._id.toString() === userId.toString()
  );
  if (!user) {
    return next(new customError("User is not in this class", 400));
  }

  //remove user from class
  await user.remove();

  //update class
  userClass.save();
  res.json({
    success: true,
    message: "User successfully removed",
    userClass,
  });
});

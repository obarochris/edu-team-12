const express = require("express");
const {
  createClass,
  addActivity,
  addAnnoucement,
  joinClass,
  deleteUserFromClass,  
  adminDeleteUser,
} = require("../controller/classController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

router.route("/addClass").post(isLoggedIn, customRole("teacher"), createClass);
router
  .route("/addActivity")
  .post(isLoggedIn, customRole("teacher"), addActivity);
router
  .route("/addAnnoucement")
  .post(isLoggedIn, customRole("teacher"), addAnnoucement);
router.route("/joinClass").put(isLoggedIn, joinClass);
router.route("/deleteUserFromClass").delete(isLoggedIn, deleteUserFromClass);
router.route("/adminDeleteUser").delete(isLoggedIn, customRole("teacher"), adminDeleteUser);

module.exports = router;

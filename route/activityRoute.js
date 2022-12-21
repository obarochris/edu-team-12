
const express = require("express");
const { createActivity } = require("../controller/activityController");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middleware/user");

router.route('/createNewActivity').post(isLoggedIn, customRole('teacher'),  createActivity)

module.exports = router;
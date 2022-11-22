const express = require('express');
const { createID, viewIds } = require('../controller/registrationController');
const router = express.Router();

router.route("/createId").post(createID);
router.route("/getAllRegistrations").get(viewIds)

module.exports = router;



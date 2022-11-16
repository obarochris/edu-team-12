const express = require('express');
const { createAccount, login } = require('../controller/user');
const router = express.Router();



router.route("/register").post(createAccount);
router.route("/login").post(login);







module.exports = router;
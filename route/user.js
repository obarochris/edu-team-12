const express = require("express");
const { createAccount, login, getUsers } = require("../controller/user");
const router = express.Router();

router.route("/register").post(createAccount);
router.route("/login").post(login);
router.route("/getAllUsers").get(getUsers);

module.exports = router;

const express = require("express");
const {
  createAccount,
  login,
  updateUser,
  deleteUser,
  getAllStudents,
  getAllTeacher,
  adminGetAllUsers,
  adminGetOnlyAdmin,
} = require("../controller/user");
const { isLoggedIn, customRole } = require("../middleware/user");
const router = express.Router();

router.route("/register").post(createAccount);
router.route("/login").post(login);  
router.route("/getAllStudents").get(getAllStudents);
router.route("/getAllTeachers").get(getAllTeacher);
router.route("/updateUser/:id").put(isLoggedIn, updateUser);
router.route("/deleteUser/:id").delete(isLoggedIn, deleteUser);
router.route("/adminGetAllUsers").get(isLoggedIn, customRole("teacher"), adminGetAllUsers); 
router.route("/adminGetOnlyAdmin").get(isLoggedIn, customRole("admin"), adminGetOnlyAdmin);



module.exports = router;

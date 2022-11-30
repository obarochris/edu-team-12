const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));


//import route
const user = require("./route/user");
const register = require("./route/registration");

//router middleware
app.use("/api/v1", user);
app.use("/api/v1", register)

app.get("/test", (req, res) => {
  res.json("signup Test");
});

module.exports = app;

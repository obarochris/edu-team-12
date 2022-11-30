const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');

const userSchema = mongoose.Schema({
    registration_id: {
        type: String,
        required: [true, "Please provide a name"],
        maxLength: [20, "Name should be under 20 characters"],
    },
    firstName: {
        type: String,
        required: [true, "Please provide your first name"],
        maxLength: [20, "Name should be under 40 characters"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide your last name"],
        maxLength: [20, "Name should be under 40 characters"],
    },
    middleName: {
        type: String,
        required: [true, "Please provide your middle name"],
        maxLength: [20, "Name should be under 40 characters"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        validate: [validator.isEmail, "Please enter email in the correct format"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [6, "password should be at least 6 char"],
        select: false,
      },
    role: {
    type: String,
    default: 'student'
    },
    registration: {
        type: mongoose.Schema.ObjectId,
        ref: 'Registration',
        //required: true
    },
    studClass: {
        type: mongoose.Schema.ObjectId,
        ref: 'Class',
        // required: true
    },
    photo: {
        id: { 
          type: String,
          required: true
        },
        secure_url: {
          type: String,
          required: true
        },
      },
      createdAt: {
        type: Date,
      },
});

//encrypt password before save
userSchema.pre("save", async function(next) {
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
});

//validate password sent by user
userSchema.methods.isValidatedPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
};

//create and return JWT Token
userSchema.methods.getToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
};

module.exports = mongoose.model("User", userSchema);

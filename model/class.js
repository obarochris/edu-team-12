const mongoose = require('mongoose');
const validator = require("validator");

const classSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please provide Registration number"],
        maxLength: [20, "Name should be under 20 characters"],
        unique: true,
    },
    Activities: {
        title: {
            type: String,
            maxLength: [50, "Name should be under 20 characters"],
        },
        description: {
            type: String,
        },
        createdAt: {
          type: Date  
        },
        status: {
            type: String,
            required: [true, "Please select category from options"],
            default: 'pending',
            enum: [
                'pending',
                'completed'
            ],
            message: "Please choose status from options available"
        }
    }
});

module.exports = mongoose.model("Class", classSchema);

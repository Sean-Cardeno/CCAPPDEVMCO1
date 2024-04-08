const mongoose = require("mongoose")
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
    fiveStarPity: {
        type: Number,
        required: true,
        default: 0
    },
    fourStarPity: {
        type: Number,
        required: true,
        default: 0
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    },
    credits: {
        type: Number,
        required: true,
        default: 0
    },
    Rolls: {
        type: Number,
        required: true,
        default: 0
    },
    TotalRolls: {
        type: Number,
        required: true,
        default: 0
    },
    TotalTasksCompleted: {
        type: Number,
        required: true,
        default: 0
    }
})
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("userdatas", userSchema);
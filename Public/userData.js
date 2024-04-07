const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false
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

module.exports = mongoose.model("userdatas", userSchema);
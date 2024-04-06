const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    taskName: {
        type: String,
        required: true
    },
    taskDesc: {
        type: String,
        required: false,
    },
    taskDateGiven: {
        type: Date,
        required: true,
        default: Date.now
    },
    taskDateDue: {
        type: Date,
        required: false,
    },
    taskDateCompleted: {
        type: Date,
        required: false,
    },
    TaskCreditsReward: {
        type: Number,
        required: true,
        default: 0
    },
    TaskRollReward: {
        type: Number,
        required: true,
        default: 0
    }
})

module.exports = mongoose.model("tasks", taskSchema)
const mongoose = require("mongoose");

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
    },
    taskDateGiven: {
        type: Date,
        required: true,
        default: Date.now
    },
    taskDateDue: {
        type: Date,
    },
    taskDateCompleted: {
        type: Date,
    },
    taskCreditsReward: {
        type: Number,
        required: true,
        default: 0
    },
    taskRollReward: {
        type: Number,
        required: true,
        default: 0
    },
    taskStatus: {
        type: String,
        required: true,
        enum: ['Not Started', 'Started','Completed'],
        default: 'Not Started' 
    },
    isTaskDeleted: {
        type: Boolean,
        required: true,
        default: false
    },
    isTaskOverdue: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("tasks", taskSchema);

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));


mongoose.connect('mongodb+srv://vraiz:123@ccapdevmco.3w1lh3c.mongodb.net');

// Import the userData schema
const UserData = require('./userData'); // Assuming the file is named userData.js and is in the same directory
const Task = require('./tasks');
const Items = require('./inventory');
// Register Account
app.post('/register', async (req, res) => {
    try {
        const { userName, userPassword, email } = req.body;

        // Check if user exists
        let user = await UserData.findOne({ userName });
        if (user) {
            return res.status(400).send('Username already exists');
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        user = new UserData({ userName, userPassword: hashedPassword, email });
        await user.save();
        console.log("New user registered: ", user);
        res.status(201).send('User created successfully');
    } catch (err) {
        res.status(500).send('Server error');
        console.log("Error: ", err);
    }
});

app.post('/login', async (req, res) => {
    const { email, userPassword } = req.body;

    try {
        let user = await UserData.findOne({ email });  // Changed from userName to email
        if (user && await bcrypt.compare(userPassword, user.userPassword)) {
            res.json({ success: true, userID: user._id }); // Send success status and userID
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});



app.post('/createTask', async (req, res) => {
    try {
        const { userID, taskName, taskDesc, taskDateDue } = req.body;
        console.log("Task data received from frontend:", req.body);
        const newTask = new Task({
            userID,
            taskName,
            taskDesc,
            taskDateDue
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' }); // Correctly formatted JSON response
    } catch (err) {
        console.error("Error creating task: ", err);
        res.status(500).json({ error: 'Server error' }); // Correctly formatted JSON response
    }
});


app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Update task endpoint
app.put('/updateTask/:taskID', async (req, res) => {
    const { taskID } = req.params;
    const { taskName, taskDesc, taskDateDue } = req.body;

    try {
        await Task.findByIdAndUpdate(taskID, {
            taskName,
            taskDesc,
            taskDateDue
        });
        res.send('Task updated successfully');
    } catch (err) {
        console.error("Error updating task: ", err);
        res.status(500).send('Server error');
    }
});

// Delete task endpoint
app.delete('/deleteTask/:taskID', async (req, res) => {
    const { taskID } = req.params;

    try {
        await Task.findByIdAndDelete(taskID);
        res.send('Task deleted successfully');
    } catch (err) {
        console.error("Error deleting task: ", err);
        res.status(500).send('Server error');
    }
});



app.get('/getTasks', async (req, res) => {
    try {
        const userID = req.query.userID;
        if (!userID) {
            return res.status(400).send('User ID is required');
        }

        const tasks = await Task.find({ userID });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks: ", err);
        res.status(500).send('Server error');
    }
});
app.get('/getTask/:taskID', async (req, res) => {
    try {
        const taskID = req.params.taskID;
        const task = await Task.findById(taskID);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (err) {
        console.error("Error fetching task data:", err);
        res.status(500).json({ error: 'Server error' });
    }
});



app.get('/tasks/getUser/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const tasks = await Task.find({ userID });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks by user ID: ", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/getUserData/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const userData = await UserData.findById(userID); // Use UserData, not userData

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userData);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/userdatas/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const userData = await UserData.findById(userID);

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userData);
    } catch (err) {
        console.error("Error fetching user data:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landingpage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

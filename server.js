const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();


const app = express();
var corsOptions = {
    origin: 'https://gamblergoals.onrender.com/',
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
const UserData = require('./Public/userData');
const Task = require('./Public/tasks');

mongoose.connect('mongodb+srv://vraiz:123@ccapdevmco.3w1lh3c.mongodb.net');


passport.use(new LocalStrategy({ usernameField: 'email' }, UserData.authenticate()));
passport.serializeUser(UserData.serializeUser());
passport.deserializeUser(UserData.deserializeUser());
// Route for user registration
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;
    const newUser = new UserData({ email, username });
    UserData.register(newUser, password, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Error registering user" });
        }
        passport.authenticate("local")(req, res, () => {
            res.status(201).json({ success: true, message: "User created successfully" })
            res.redirect("/main");
        });
    });
});


app.post("/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }
            return res.status(200).json({ success: true, message: 'Login successful' });
        });
    })(req, res, next);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './Public/reg-page.html'));
});


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        console.log("User is not authenticated. Redirecting to login page.");
        return res.redirect('/'); // Redirect to login page
    }
}

// Route for Character.html
app.get('/Character', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected/Character.html'));
});

// Route for Calendar.html
app.get('/Calendar', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected/Calendar.html'));
});

// Route for gacha.html
app.get('/gacha', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected/gacha.html'));
});

// Route for main.html
app.get('/main', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected/main.html'));
});

// Route for Store.html
app.get('/Store', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected/Store.html'));
});

app.post('/createTask', isAuthenticated, async (req, res) => {
    try {
        const { userID, taskName, taskDesc, taskDateDue, taskCreditsReward } = req.body;
        console.log("Task data received from frontend:", req.body);
        const newTask = new Task({
            userID,
            taskName,
            taskDesc,
            taskDateDue,
            taskCreditsReward,
        });

        await newTask.save();
        res.status(201).json({ message: 'Task created successfully' }); // Correctly formatted JSON response
    } catch (err) {
        console.error("Error creating task: ", err);
        res.status(500).json({ error: 'Server error' }); // Correctly formatted JSON response
    }
});

// Update task endpoint
app.put('/updateTask/:taskID', isAuthenticated, async (req, res) => {
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
app.patch('/deleteTask/:taskID', isAuthenticated, async (req, res) => {
    const { taskID } = req.params;

    try {
        const updatedTask = await Task.findByIdAndUpdate(taskID,
            { isTaskDeleted: true },
            { new: true } // This option returns the document after update was applied.
        );

        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }

        res.json({ message: 'Task marked as deleted successfully', task: updatedTask });
    } catch (err) {
        console.error("Error marking task as deleted: ", err);
        res.status(500).send('Server error');
    }
});



app.get('/getTasks', isAuthenticated, async (req, res) => {
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
app.get('/getTask/:taskID', isAuthenticated, async (req, res) => {
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



app.get('/tasks/getUser/:userID', isAuthenticated, async (req, res) => {
    try {
        const userID = req.params.userID;
        const tasks = await Task.find({ userID });
        res.json(tasks);
    } catch (err) {
        console.error("Error fetching tasks by user ID: ", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/getUserData/:userID', isAuthenticated, async (req, res) => {
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

app.get('/userdatas/:userID', isAuthenticated, async (req, res) => {
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
    res.sendFile(path.join(__dirname, 'Public/landingpage.html'));
});

app.use(express.static(path.join(__dirname, 'Public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

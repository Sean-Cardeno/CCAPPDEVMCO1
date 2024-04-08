const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

const UserData = require('./Public/userData'); // Ensure this model uses passport-local-mongoose
const Task = require('./Public/tasks');
const Items = require('./Public/inventory');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));


const mySecretKey = "secrettt";
app.use(session({
    secret: mySecretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 3600000 } // Note: `secure: true` should be used in production with HTTPS
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(UserData.authenticate()));
passport.serializeUser(UserData.serializeUser());
passport.deserializeUser(UserData.deserializeUser());

mongoose.connect('mongodb+srv://vraiz:123@ccapdevmco.3w1lh3c.mongodb.net');

function isAuthenticated(req, res, next) {
    if (req.session.userID) {
        return next();
    }
    res.redirect('/'); // Redirect to the landing page if not authenticated
}


// Register Account
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    UserData.register(new UserData({ username: username, email: email }), password, (err, user) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        passport.authenticate('local')(req, res, () => {
            res.status(201).send('User created successfully');
        });
    });
});

app.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, userID: req.user._id });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.post('/createTask', isAuthenticated, async (req, res) => {
    try {
        const { userID, taskName, taskDesc, taskDateDue, taskCreditsReward, taskStatus } = req.body;
        console.log("Task data received from frontend:", req.body);
        const newTask = new Task({
            userID,
            taskName,
            taskDesc,
            taskDateDue,
            taskCreditsReward,
            taskStatus,
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
app.patch('/deleteTask/:taskID', async (req, res) => {

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

app.get('/main', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected', 'main.html'));
});

app.get('/gacha', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected', 'gacha.html'));
});

app.get('/calendar', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected', 'calendar.html'));
});

app.get('/store', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'Protected', 'store.html'));
});

app.get('/character', isAuthenticated, (req, res) => {
    res.sendFile(path.join('Protected', 'character.html'));
});




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Public/landingpage.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

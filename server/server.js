const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from the React frontend
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials like cookies
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Allow socket.io connections from the frontend
        methods: ['GET', 'POST'],
        credentials: true, // Allow credentials like cookies
    }
});

// MongoDB connection (optional, still useful for future use)
const mongoURI = process.env.MONGO_URI; // Mongo URI from .env file
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if DB connection fails
    });

// Dummy users array for authentication (keeping this for now)
const users = [
    { id: 1, username: 'Admin1', password: bcrypt.hashSync('123', 10) },
    { id: 2, username: 'Admin2', password: bcrypt.hashSync('456', 10) }
];

// Passport strategy for local login
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(u => u.username === username);
    if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

        return done(null, user);  // Correct user found
    });
}));

passport.serializeUser((user, done) => done(null, user.id)); // Store user id in the session
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user); // Restore user from session id
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,    // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production',  // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000  // 1 day expiry for session cookies
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Login route using passport authentication
app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log('Logged in user:', req.user); // Log the authenticated user
    res.json({ username: req.user.username });
});

// Logout route
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Logout failed' });
        res.json({ message: 'Logged out successfully' });
    });
});

// Serve React's static files (build folder)
app.use(express.static(path.join(__dirname, 'build')));

// Socket.io connection handling
const socketUsers = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining the chat
    socket.on('join', ({ username }) => {
        const user = { name: username, socketId: socket.id };
        socketUsers.set(socket.id, user);
        io.emit('updateUserList', Array.from(socketUsers.values())); // Emit updated user list
    });

    // Handle incoming messages
    socket.on('sendMessage', (message) => {
        io.emit('newMessage', message); // Broadcast message to all clients
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        socketUsers.delete(socket.id); // Remove user from the map
        io.emit('updateUserList', Array.from(socketUsers.values())); // Emit updated user list
    });
});

// Catch-all route for serving React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

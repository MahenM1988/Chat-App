require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');

// MongoDB Models
const UserActivity = require('./models/userActivity');
const ChatMessage = require('./models/chatMessage');
const MessageReaction = require('./models/MessageReaction');  // New model for storing reactions

const app = express();
const server = http.createServer(app);

// Enable CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,  // Allow credentials like cookies
};
app.use(cors(corsOptions));

// Socket.io configuration
const io = new Server(server, {
  cors: corsOptions,
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the process on DB connection failure
  });

// User authentication
const users = [
  { id: 1, username: 'Admin1', password: bcryptjs.hashSync('123', 10) },
  { id: 2, username: 'Admin2', password: bcryptjs.hashSync('456', 10) },
];

passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find((u) => u.username === username);
  if (!user) return done(null, false, { message: 'Incorrect username.' });

  bcryptjs.compare(password, user.password, (err, isMatch) => {
    if (err) return done(err);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,  // 1 day expiry
  },
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
  console.log('Logged in user:', req.user);
  res.json({ username: req.user.username });
});

app.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logged out successfully' });
  });
});

// Socket.io configuration
const socketUsers = new Map();
const reactions = {};  // Store reactions globally

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', ({ username }) => {
    const user = { name: username, socketId: socket.id };
    socketUsers.set(socket.id, user);
    io.emit('updateUserList', Array.from(socketUsers.values()));  // Emit updated user list
  });

  socket.on('sendMessage', (message) => {
    if (message?.username && message?.content) {
      const chatMessage = new ChatMessage({
        username: message.username,
        message: message.content,
        timestamp: new Date(),
      });

      chatMessage.save()
        .then(() => console.log('Chat message logged to MongoDB'))
        .catch((err) => console.error('Error logging chat message:', err));

      io.emit('newMessage', message);
    } else {
      console.error('Invalid message data received:', message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    socketUsers.delete(socket.id);
    io.emit('updateUserList', Array.from(socketUsers.values()));  // Emit updated user list
  });
});

// Serve React's static files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

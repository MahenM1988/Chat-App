const mongoose = require('mongoose');

// Define the UserActivity schema
const userActivitySchema = new mongoose.Schema({
    username: { type: String, required: true },
    action: { type: String, required: true }, // Action like 'login' or 'logout'
    timestamp: { type: Date, default: Date.now },
});

// Create the UserActivity model
const UserActivity = mongoose.model('UserActivity', userActivitySchema);

module.exports = UserActivity;

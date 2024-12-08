const mongoose = require('mongoose');

const messageReactionSchema = new mongoose.Schema({
    messageId: { type: String, required: true },
    emoji: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create the MessageReaction model
const MessageReaction = mongoose.model('MessageReaction',  messageReactionSchema);

module.exports = MessageReaction;

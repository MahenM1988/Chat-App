// Frontend - React (Chat.js)

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

function Chat({ username, ip, handleLogout }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsersList] = useState([]);
    const [reactions, setReactions] = useState({});
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    useEffect(() => {
        socket.emit('join', { username, ip });

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('updateUserList', (users) => {
            setUsersList(users);
        });

        socket.on('newReaction', (reactionData) => {
            const { messageId, emoji, user } = reactionData;
            setReactions((prevReactions) => {
                const messageReactions = prevReactions[messageId] || {};
                return {
                    ...prevReactions,
                    [messageId]: { ...messageReactions, [user]: emoji },
                };
            });
        });

        return () => {
            socket.off('newMessage');
            socket.off('updateUserList');
            socket.off('newReaction');
        };
    }, [username, ip]);

    const sendMessage = () => {
        if (input.trim()) {
            const timestamp = new Date().toISOString(); // Create timestamp
            const messageId = `${username}-${ip}-${timestamp}`; // Generate unique message ID
            const message = { id: messageId, content: input, timestamp, username, ip };
            socket.emit('sendMessage', message); // Send message with unique ID to backend
            setInput(''); // Clear input field
        }
    };   

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    return (
        <div className="chat-container">
            <button className="logout-button" onClick={handleLogout}>
                Logout
            </button>
            <h3>Real-Time Chat App</h3>
            <div className="chat-log">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className="message"
                        onMouseEnter={() => setHoveredMessageId(msg.id)}
                        onMouseLeave={() => setHoveredMessageId(null)}
                    >
                        <p>
                            [{formatTimestamp(msg.timestamp)}] {msg.username} ({msg.ip}): {msg.content}
                        </p>
                    </div>
                ))}
            </div>
            <div className="user-list">
                <h4>Connected Users</h4>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.name || 'Unnamed User'}</li>
                    ))}
                </ul>
            </div>
            <input
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message here..."
            />
            <p>&copy; 2024 Mahen Mahindaratne. All Rights Reserved.</p>
        </div>
    );
}

export default Chat;

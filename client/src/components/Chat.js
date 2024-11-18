import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './Chat.css';

const socket = io('http://localhost:5000');

function Chat({ username, ip, handleLogout }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsersList] = useState([]);

    // Join the chat with username and IP
    useEffect(() => {
        socket.emit('join', { username, ip });

        // Listen for new messages
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]); // Add the new message to the chat log
        });

        // Listen for user list updates
        socket.on('updateUserList', (users) => {
            setUsersList(users);
        });

        // Cleanup socket listeners on component unmount
        return () => {
            socket.off('newMessage');
            socket.off('updateUserList');
        };
    }, [username, ip]);

    // Send a message to the server
    const sendMessage = () => {
        if (input.trim()) {
            const message = { content: input, timestamp: new Date(), username, ip };
            socket.emit('sendMessage', message); // Emit message to the server
            setInput(''); // Clear input field
        }
    };

    // Format timestamp for display
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
            <div className="description-container">
                <p>
                    This is a Real-Time Chat App where connected users can share live messages
                    with each other.
                </p>
            </div>
            <div className="chat-log">
                {messages.map((msg, index) => (
                    <div key={index}>
                        [{formatTimestamp(msg.timestamp)}] {msg.username} ({msg.ip}): {msg.content}
                    </div>
                ))}
            </div>
            <div className="user-list">
                <h4>Connected Users</h4>
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>
                            {user.name ? user.name : 'Unnamed User'}
                        </li>
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
        </div>
    );
}

export default Chat;

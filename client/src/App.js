import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import Login from './components/Login';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const [ip, setIp] = useState('');
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Default to local dev if not set

    // Get the user's public IP when the component mounts
    useEffect(() => {
        const getPublicIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIp(data.ip);
            } catch (error) {
                console.error('Error fetching public IP:', error);
                alert('Unable to fetch public IP.');
            }
        };

        getPublicIP();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io(apiUrl, { withCredentials: true });

            newSocket.on('connect', () => {
                console.log('Connected to backend via Socket.IO');
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err);
                alert('Connection to the server failed. Please try again later.');
            });

            newSocket.on('updateUserList', (users) => {
                setUsers(users);
            });

            return () => newSocket.close();
        }
    }, [isAuthenticated]);

    const handleLogin = async (username, password) => {
        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUsername(data.username);
                setIsAuthenticated(true);
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${apiUrl}/logout`, { 
                method: 'POST',
                credentials: 'include',
            });

            setIsAuthenticated(false);
            setUsername('');
            setIp('');
            setUsers([]);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="app-container">
            {!isAuthenticated ? (
                <Login handleLogin={handleLogin} />
            ) : (
                <Chat socket={socket} username={username} ip={ip} handleLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;

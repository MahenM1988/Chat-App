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

    useEffect(() => {
        // Get the user's public IP when the component mounts
        const getPublicIP = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIp(data.ip); // Store the user's IP address
            } catch (error) {
                console.error('Error fetching public IP:', error);
            }
        };

        getPublicIP();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const newSocket = io('http://localhost/5000', { withCredentials: true }); // Ensure socket connection uses cookies
            setSocket(newSocket);

            // Listen for updates to the user list
            newSocket.on('updateUserList', (users) => {
                setUsers(users);
            });

            // Cleanup on component unmount or authentication change
            return () => newSocket.close();
        }
    }, [isAuthenticated]); 

    const handleLogin = async (username, password) => {
        try {
            // Send login request to the backend with credentials included
            const response = await fetch('http://localhost/5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Ensure cookies (session) are sent with the request
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
        // Send logout request to backend
        await fetch('http://localhost/5000/logout', { 
            method: 'POST', 
            credentials: 'include' // Ensure session cookie is sent with logout request
        });

        setIsAuthenticated(false); // Reset authentication state
        setUsername(''); // Reset username state
        setIp(''); // Reset IP state
        setUsers([]); // Clear users list
    };

    return (
        <div className="app-container">
            {/* Show Login or Chat components based on authentication status */}
            {!isAuthenticated ? (
                <Login handleLogin={handleLogin} />
            ) : (
                <Chat socket={socket} username={username} ip={ip} handleLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;

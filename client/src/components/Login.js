import React, { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Track error message
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Start loading
    try {
      await handleLogin(username, password); // Pass the credentials to the parent
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <div>
            <label htmlFor="username" style={labelStyles}>Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyles}
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" style={labelStyles}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyles}
              aria-label="Password"
            />
          </div>
          {error && <p style={errorStyles}>{error}</p>} {/* Display error message */}
          <button type="submit" disabled={loading} style={buttonStyles}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles (can be replaced with your own CSS or styled-components)
const containerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#f4f4f4',
};

const formStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  width: '300px',
};

const inputStyles = {
  width: '100%',
  padding: '10px',
  margin: '8px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const buttonStyles = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s',
};

const labelStyles = {
  fontWeight: 'bold',
};

const errorStyles = {
  color: 'red',
  fontSize: '14px',
  marginTop: '10px',
};

export default Login;

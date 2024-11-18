import React, { useState } from 'react';

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setLoading(true); 
    try {
      await handleLogin(username, password); 
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div style={containerStyles}>
      <div style={formStyles}>
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p style={pStyles}>
            For testing purposes, two example accounts are provided:
          </p>
          <p style={pStyles}>
            - Username: <strong>Admin1</strong>, Password: <strong>123</strong>
          </p>
          <p style={pStyles}>
            - Username: <strong>Admin2</strong>, Password: <strong>456</strong>
          </p>
          <p style={pStyles}>
            Please use these credentials to log in.
          </p>
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
          <p style={{ ...pStyles, marginTop: '20px' }}>
            &copy; 2024 Mahen Mahindaratne. All Rights Reserved.
          </p>
        </form>
      </div>
    </div>
  );
};

const containerStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', 
  backgroundColor: '#1e1e1e', 
  margin: 0, 
  color: '#fff',
};

const formStyles = {
  backgroundColor: '#333', 
  padding: '20px',
  borderRadius: '12px', 
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)', 
  width: '100%', 
  maxWidth: '500px', 
  boxSizing: 'border-box', 
  textAlign: 'center', 
  border: '1px solid #444', 
};

const inputStyles = {
  width: '100%',
  padding: '12px 15px', 
  margin: '12px 0',
  borderRadius: '8px', 
  border: '1px solid #555', 
  backgroundColor: '#222', 
  color: '#fff', 
  fontSize: '16px', 
  transition: 'all 0.3s ease', 
  boxSizing: 'border-box', 
};

const buttonStyles = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#e74c3c', 
  color: 'white',
  border: 'none',
  borderRadius: '8px', 
  cursor: 'pointer',
  fontSize: '18px',
  transition: 'background-color 0.3s, transform 0.2s', 
  boxSizing: 'border-box', 
  textTransform: 'uppercase', 
};

const labelStyles = {
  fontWeight: 'bold',
  fontSize: '18px', 
  color: '#fff', 
};

const errorStyles = {
  color: '#e74c3c', 
  fontSize: '14px',
  marginTop: '10px',
  textTransform: 'uppercase', 
  letterSpacing: '1px', 
};

const h2Styles = {
  color: '#fff', 
  fontSize: '24px', 
  fontWeight: 'bold', 
  margin: '20px 0', 
};

const pStyles = {
  color: '#fff', 
  fontSize: '16px', 
  margin: '10px 0', 
  lineHeight: '1.5', 
};

export default Login;

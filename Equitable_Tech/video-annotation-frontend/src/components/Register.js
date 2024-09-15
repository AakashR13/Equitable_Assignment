import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Reset error state
    setError('');

    // Basic validation: Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the registration API
      const response = await axios.post('http://localhost:8000/register/', {
        username,
        password,
        password_confirm: confirmPassword, // Use password_confirm key
      });

      // If registration is successful
      console.log('Registration successful:', response.data);
      setSuccess(true);

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 seconds delay

    } catch (error) {
      // Handle errors such as username already taken or invalid password
      console.error('Error registering:', error.response?.data || error);
      setError(error.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>Registration successful! Redirecting to login...</div>}
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      <button style={styles.backButton} onClick={() => navigate('/')}>
        Back
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    margin: '10px',
    width: '200px',
    fontSize: '16px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
  backButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#ccc',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
  },
};

export default Register;

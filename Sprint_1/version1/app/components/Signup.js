
"use client"
import './signup.css';
import React, { useState } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      username,
      password,
      role,
      id,
      name,
    };

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.message); // Display success message
        alert(result.message);
        // Reset form
        setUsername('');
        setPassword('');
        setRole('');
        setId('');
        setName('');
      } else {
        const error = await response.json();
        setMessage(error.message); // Display error message
        alert(error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An unexpected error occurred.');

    }

  };

  return (
    <div className="auth-container">
      
      <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /> <br/><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
        />
        <br/><br/>
        <input
          type="text"
          placeholder=" Student ID"
          value={id}
          onChange={(e) => setId(e.target.value)} 
          required
        />
        <br/><br />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <br/><br />

        <label htmlFor="role">Select Role:</label> &nbsp;
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <br /><br />

        <button type="submit">Sign up</button>
      </form>
    </div>
  );
}
export default Signup;


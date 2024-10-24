'use client';

import React, { useState, useEffect } from 'react';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(null); // Track username availability
  const [checkingUsername, setCheckingUsername] = useState(false); // Track checking state
  const [isTyping, setIsTyping] = useState(false); // Track if user is still typing

  // Debounced username check to avoid spamming API calls
  useEffect(() => {
    if (username) {
      setIsTyping(true); // User is still typing
      const delayDebounceFn = setTimeout(() => {
        setIsTyping(false); // User has stopped typing
        checkUsername();
      }, 500); // 1-second delay

      return () => clearTimeout(delayDebounceFn); // Clear timeout if username is updated quickly
    }
  }, [username]);

  const checkUsername = async () => {
    setCheckingUsername(true); // Show checking availabilities
    setUsernameAvailable(null); // Reset availability during the check

    try {
      const response = await fetch('/api/auth/userCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();
      setUsernameAvailable(result.available); // Set availability based on response
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setTimeout(() => {
        setCheckingUsername(false); // Hide checking indicator after 1 second
      }, 1000); // Ensures checking availabilities message is shown for 1 second
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure username check has finished before allowing form submission
    if (checkingUsername) {
      setMessage('Checking availability, please wait...');
      return;
    }

    // Prevent submission if username is unavailable
    if (usernameAvailable === false) {
      setMessage('Username is already taken. Please choose another.');
      return;
    }

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
        setRole('student');
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username and debounce check
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {/* Username availability checking */}
            {checkingUsername && <p className="text-sm text-blue-500 mt-2">Checking availability...</p>}
            {!checkingUsername && usernameAvailable === false && (
              <p className="text-sm text-red-500 mt-2">Username is taken</p>
            )}
            {!checkingUsername && usernameAvailable === true && (
              <p className="text-sm text-green-500 mt-2">Username is valid</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Student ID Field */}
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              id="id"
              type="text"
              placeholder="Enter your Student ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Full Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Select Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={usernameAvailable === false || checkingUsername} // Disable button during checking or if username is unavailable
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
              usernameAvailable === false || checkingUsername ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Sign up
          </button>
          {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </form>
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

// src/components/Login.jsx
import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const navigate            = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { data } = await login({ email });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role',  data.user.role);

      // now check for 'admin'
      if (data.user.role === 'admin') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail]   = useState('');
  const [error, setError]   = useState('');
  const navigate            = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ email });
      console.log("Login Response Data:", data); // <-- Debug log
      localStorage.setItem('token', data.token);
      localStorage.setItem('role',  data.user.role);
      navigate(data.user.role === 'admin' ? '/manager' : '/employee');
    } catch (err) {
      console.error("Login Error:", err.response || err); // Debug log
      setError(err.response?.data?.message || 'Login failed');
    }
  };


  return (
    <div className="login-page">
      <div className="login-box">
        <img src="/geolah.png" alt="Geolah Logo" className="login-logo" />
        <h2 className="login-title">Sign in</h2>
        <p className="login-subtitle">Use your email account</p>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Next</button>
        </form>
      </div>
    </div>
  );
}

// File: src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Login Component
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      localStorage.setItem('user', JSON.stringify(response.data));
      window.location.href = '/home';
    } catch (error) {
      console.error('Login error', error);
      alert('Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <p>Don&apos;t have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
}

export default Login;
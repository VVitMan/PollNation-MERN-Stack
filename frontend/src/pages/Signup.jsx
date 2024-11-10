// File: src/pages/Signup.jsx
import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Signup
function Signup() {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('username', username);
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePicture) {
        formData.append('picture', profilePicture);
      }
  
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        localStorage.setItem('user', JSON.stringify(response.data));
        window.location.href = '/home';
      } catch (error) {
        console.error('Signup error', error);
        alert('Signup failed');
      }
    };
  
    return (
      <div className="auth-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    );
  }
  
  export default Signup;
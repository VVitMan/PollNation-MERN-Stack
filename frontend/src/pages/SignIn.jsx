import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignIn() {
  /* Navigate */
  const navigate = useNavigate();

  /* Dispatch */
  const dispatch = useDispatch();

  /* Loading and Error State */
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  /* Form Data State */
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* Handling Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      /* Fetch API */
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // fetch need to have it
      if (data.success === false) {
        dispatch(signInFailure(data));
        // console.log({ message: data.message }); // ex. data.message(user not found),ex.2 {message: 'Invalid Credentials'}
        console.log(data);
        return;
      }
      dispatch(signInSuccess(data));
      // Navigate to the Home page
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error)); // ex. "Failed to fetch", when not connection
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
        <input
          type="text"
          id="email"
          placeholder="Email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          className="bg-slate-700 text-white p-3 rounded-lg 
        uppercase hover:opacity-95 disabled:opacity-80"
        >
          {/* Loading Effect */}
          {loading ? "Loading..." : "Sign in"}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="flex gap-2 mt-5">
        <p>Don&apos;t Have an account</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>

      <p className="text-red-700 mt-5">
        {error ? error.message || 'Something went wrong!' : ''}
      </p>
    </div>
  );
}

// // File: src/pages/Signup.jsx
// import { useState } from 'react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000';

// // Signup
// function Signup() {
//     const [username, setUsername] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [profilePicture, setProfilePicture] = useState(null);

//     const handleSubmit = async (e) => {
//       e.preventDefault();
//       const formData = new FormData();
//       formData.append('username', username);
//       formData.append('firstName', firstName);
//       formData.append('lastName', lastName);
//       formData.append('email', email);
//       formData.append('password', password);
//       if (profilePicture) {
//         formData.append('picture', profilePicture);
//       }

//       try {
//         const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data'
//           }
//         });
//         localStorage.setItem('user', JSON.stringify(response.data));
//         window.location.href = '/home';
//       } catch (error) {
//         console.error('Signup error', error);
//         alert('Signup failed');
//       }
//     };

//     return (
//       <div className="auth-container">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
//           <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
//           <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
//           <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//           <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//           <input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} />
//           <button type="submit">Sign Up</button>
//         </form>
//         <p>Already have an account? <a href="/login">Login</a></p>
//       </div>
//     );
//   }

//   export default Signup;

// // File: src/pages/Login.jsx
// import { useState } from 'react';
// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000';

// // Login Component
// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
//       localStorage.setItem('user', JSON.stringify(response.data));
//       window.location.href = '/home';
//     } catch (error) {
//       console.error('Login error', error);
//       alert('Login failed');
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <button type="submit">Login</button>
//       </form>
//       <p>Don&apos;t have an account? <a href="/signup">Sign Up</a></p>
//     </div>
//   );
// }

// export default Login;

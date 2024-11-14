import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import {signInStart, signInSuccess, signInFailure} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignUp() {
  /* Navigate */
  const navigate = useNavigate();

  /* Dispatch */
  const dispatch = useDispatch();

  /* Loading and Error State */
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      // fetch need to have it
      if (data.success === false) {
        dispatch(signInFailure(data));
        // console.log({ message: data.message }); // ex. data.message(user not found),ex.2 {message: 'Invalid Credentials'}
        // console.log(data);
        return;
      }
      dispatch(signInSuccess(data));
      // Navigate to the Home page
      navigate("/");
    } catch (error) {
        dispatch(signInFailure(error));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          id="username"
          placeholder="Username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

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
          {loading ? 'Loading...' : 'Sign up'}
        </button>

        {/* OAuth */}
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>

      <p className="text-red-700 mt-5"> {error ? error.message || 'Something went wrong!' : ''}</p>
    </div>
  );
}

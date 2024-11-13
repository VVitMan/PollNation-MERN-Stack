import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  /* Navigate */
  const navigate = useNavigate();

  /* Loading and Error State */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /* Form Data State */
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* Handling Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      /* Fetch API */
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      // fetch need to have it
      if (data.success === false) {
        setError(true);
        return;
      }
      /* Navigate to the Home page */
      navigate('/')
    } catch (error) {
        setLoading(false);
        setError(true);
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
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

      <p className="text-red-700 mt-5">{error && 'Something went wrong'}</p>
    </div>
  );
}

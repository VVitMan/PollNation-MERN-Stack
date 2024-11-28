import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import styles from "./SignIn.module.css"; // Import the CSS module

export default function SignIn() {
  /* Navigate */
  const navigate = useNavigate();

  /* Dispatch */
  const dispatch = useDispatch();

  /* Loading and Error State */
  // Use Redux state for loading and error tracking
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  const { loading, error } = useSelector((state) => state.user);

  /* Form Data State */
  const [formData, setFormData] = useState({});
  const handleChange = (e) => {
    // Update form data when input changes
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  /* Handling Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart()); // Start the loading state
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data
      });
      const data = await res.json();
      // console.log("data:",data)

      // Check if the response indicates a failure
      if (data.success === false) {
        dispatch(signInFailure(data)); // Dispatch failure action
        console.log(data); // Log error details
        return;
      }

      dispatch(signInSuccess(data)); // Dispatch success action
      navigate("/"); // Navigate to the Home page on success
    } catch (error) {
      dispatch(signInFailure(error)); // Handle fetch error
    }
  };

  console.log(error); // Log
  return (
    <div className={styles.signinContainer}>
      <h1 className={styles.title}>Sign In</h1>
      {/* Form Section */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Email Input */}
        <input
          type="text"
          id="email"
          placeholder="Email"
          className={styles.input}
          onChange={handleChange}
        />
        {/* Password Input */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          className={styles.input}
          onChange={handleChange}
        />
        {/* Submit Button */}
        <button
          type="submit"
          className={`${styles.submitButton} ${loading && styles.loading}`}
          disabled={loading}
        >
          {/* Display "Loading..." during API call */}
          {loading ? "Loading..." : "Sign in"}
        </button>
        {/* Google OAuth Button */}
        <OAuth />
      </form>

      {/* Sign Up Link */}
      <div className={styles.additionalSpacing}>
        <p>
          Don’t have an account?{" "}
          <Link to="/sign-up" className={styles.link}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Error Message Display */}
      {error && <p className={styles.errorMessage}>{error.message || "Something went wrong"}</p>}
    </div>
  );
}
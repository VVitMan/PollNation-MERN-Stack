import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure, clearError } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import styles from "./SignIn.module.css"; // Import the CSS module

export default function SignIn() {
  /* Navigate */
  const navigate = useNavigate();

  /* Dispatch */
  const dispatch = useDispatch();

  /* Loading and Error State */
  const { loading, error } = useSelector((state) => state.user);

  /* Form Data State */
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Clear the error when the component is mounted
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /* Validation Functions */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validate common email formats
    return emailRegex.test(email);
  };

  // const isValidPassword = (password) => {
  //   // Ensure password is strong: At least 8 characters, one uppercase, one lowercase, one number, and one special character
  //   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  //   return passwordRegex.test(password);
  // };

  /* Handling Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;


    if (!email) {
      alert("📧 Please enter your email address.");
      return;
    }
  
    // Validate email format if provided
    if (!isValidEmail(email)) {
      alert("📧 Please enter a valid email address. Example: user@example.com");
      return;
    }
  
    if (!password) {
      alert("🔒 Please enter your password.");
      return;
    }

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

      if (!res.ok || data.success === false) {
        dispatch(signInFailure(data)); // Dispatch failure action
        return;
      }

      dispatch(signInSuccess(data)); // Dispatch success action
      navigate("/"); // Navigate to the Home page on success
    } catch (error) {
      dispatch(signInFailure(error)); // Handle fetch error
    }
  };

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
          value={formData.email}
          className={styles.input}
          onChange={handleChange}
        />
        {/* Password Input */}
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          className={styles.input}
          onChange={handleChange}
        />
        {/* Submit Button */}
        <button
          type="submit"
          className={`${styles.submitButton} ${loading && styles.loading}`}
          disabled={loading}
        >
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

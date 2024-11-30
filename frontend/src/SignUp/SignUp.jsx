import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { signInStart, signInSuccess, signInFailure, clearError } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import styles from "./SignUp.module.css"; // Import the CSS module

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
    // Update form data when input changes
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Clear the error when the component is mounted
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /* Validation Functions */
  const isValidUsername = (username) => {
    // Username: 3-15 characters, letters, numbers, underscores, hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,15}$/;
    return usernameRegex.test(username);
  };

  const isValidEmail = (email) => {
    // Basic regex to validate common email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Password must be at least 8 characters, include uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { username, email, password } = formData;
  
    // Check if required fields are provided, one by one
    if (!username) {
      alert("⚠️ Please enter a username.");
      return;
    }

    if (!isValidUsername(username)) {
      alert("⚠️ Username must be between 3 and 15 characters and can only contain letters, numbers, underscores, or hyphens.\n\nExample: user_name123");
      return;
    }
  
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
  
    // Validate password strength if provided
    if (!isValidPassword(password)) {
      alert(
        "🔒 Your password must meet the following criteria:\n\n" +
        "• At least 8 characters long\n" +
        "• Include at least one uppercase letter (e.g., A, B, C)\n" +
        "• Include at least one lowercase letter (e.g., a, b, c)\n" +
        "• Include at least one number (e.g., 1, 2, 3)\n" +
        "• Include at least one special character (e.g., !, @, #, $)\n\n" +
        "Example: MyPassword123!"
      );
      return;
    }
  
    // Proceed with sign-up if all checks pass
    try {
      dispatch(signInStart()); // Start the loading state
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data
      });
      const data = await res.json();
  
      // Check if the response indicates a failure
      if (data.success === false) {
        dispatch(signInFailure(data)); // Dispatch failure action
        console.log(data); // Log error details
        return;
      }
  
      dispatch(signInSuccess(data)); // Dispatch success action
      navigate("/"); // Navigate to the Home page on success
    } catch (error) {
      console.log("Couldn't sign up", error); // Log error details
      dispatch(signInFailure(error)); // Handle fetch error
    }
  };
  


  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      {/* Form Section */}
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Username Input */}
        <input
          type="text"
          id="username"
          placeholder="Username"
          className={styles.input}
          onChange={handleChange}
        />
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
          {loading ? "Loading..." : "Sign up"}
        </button>
        {/* Google OAuth Button */}
        <OAuth />
      </form>

      {/* Sign In Link */}
      <div className={styles.additionalSpacing}>
        <p>
          Have an account?{" "}
          <Link to="/sign-in" className={styles.link}>
            Sign in
          </Link>
        </p>
      </div>

      {/* Error Message Display */}
      {error && <p className={styles.errorMessage}>{error.message || "Something went wrong!"}</p>}
    </div>
  );
}

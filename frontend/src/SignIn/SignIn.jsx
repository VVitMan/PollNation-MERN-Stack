import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInSuccess, signInFailure, clearError } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";
// import styles from "./SignIn.module.css"; // Import the CSS module

/* Material-UI Components */
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

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

  const isValidPassword = (password) => {
    // Ensure password is strong: At least 8 characters, one uppercase, one lowercase, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
  };

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
    <Container maxWidth="xs" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sign In
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* Email Field */}
        <TextField
          fullWidth
          id="email"
          label="Email"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        {/* Password Field */}
        <TextField
          fullWidth
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Sign In"}
        </Button>

        {/* OAuth Button */}
        <OAuth />
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error.message || "Something went wrong"}
        </Alert>
      )}

      {/* Sign-Up Link */}
      <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/sign-up" style={{ textDecoration: "none", color: "#1976d2" }}>
          Sign up
        </Link>
      </Typography>
    </Container>
  );
}

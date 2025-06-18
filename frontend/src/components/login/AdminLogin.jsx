import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Admin login form component with email/password validation
function AdminLogin({
  email, // Email state from parent
  setEmail, // Email setter from parent
  password, // Password state from parent
  setPassword, // Password setter from parent
  setIsHeAdmin, // Function to toggle admin state
  error, // Error message from parent
  loading, // Loading state from parent
  handleButtonClick,
  onForgotPassword,
}) {
  const [showError, setShowError] = useState(false); // Toggle error display
  const [localError, setLocalError] = useState(""); // Local validation errors
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle login submission
  const handleLoginClick = async () => {
    if (!email.trim()) {
      setShowError(true);
      setLocalError("Please enter your email");
      return;
    }
    if (!password.trim()) {
      setShowError(true);
      setLocalError("Please enter your password");
      return;
    }

    // Clear previous errors
    setShowError(false);
    setLocalError("");

    try {
      // API call to authenticate admin
      const response = await fetch(
        "http://localhost:8080/api/employees/loginAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      // Handle failed login
      if (!response.ok) {
        setLocalError(data.error || "Login failed");
        setShowError(true);
        throw new Error(data.error || "Login failed");
      }

      localStorage.removeItem("authState");

      // Store auth data and redirect
      localStorage.setItem("authState", JSON.stringify(data));

      navigate("/app/home");
      // Handle network/API errors
    } catch (error) {
      setLocalError(error.message || "Login failed. Please try again.");
      setShowError(true);
    }
  };
  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Login form header */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          fontWeight: "bold",
          marginBottom: "2.5rem",
        }}
      >
        Admin Login
      </h2>
      {/* Email input field */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            paddingRight: "2.5rem",
            paddingLeft: "0.75rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            backgroundColor: "transparent",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
            fontSize: "1.1rem",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          <EmailIcon style={{ color: "white" }} />
        </span>
      </div>

      {/* Password input field with visibility toggle */}
      <div style={{ position: "relative", marginBottom: "0.5rem" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            paddingRight: "3.5rem",
            paddingLeft: "0.75rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            backgroundColor: "transparent",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
            fontSize: "1rem",
          }}
        />

        <InputAdornment
          position="end"
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            edge="end"
            style={{ color: "white" }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      </div>

      {/* Forgot password link */}
      <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
        <a
          href="#"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.9rem",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)")
          }
          onClick={(e) => {
            e.preventDefault();
            setIsHeAdmin(true);
            onForgotPassword();
          }}
        >
          Forgot password?
        </a>
      </div>

      {/* Login button */}
      <button
        type="button"
        onClick={handleLoginClick}
        disabled={loading}
        style={{
          marginTop: "1.5rem",
          width: "100%",
          paddingTop: "0.75rem",
          paddingBottom: "0.75rem",
          backgroundColor: "white",
          color: "black",
          fontWeight: "bold",
          borderRadius: "9999px",
          transition: "transform 0.3s ease, background-color 0.3s ease",
          fontSize: "1rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.backgroundColor = "#e5e5e5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.backgroundColor = "white";
        }}
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

      {/* Error message display */}
      {showError && (
        <div
          className="error-message"
          style={{
            color: "red",
            textAlign: "center",
            marginTop: "20px",
            fontSize: "0.9rem",
          }}
        >
          {error || localError}
        </div>
      )}
    </>
  );
}

export default AdminLogin;

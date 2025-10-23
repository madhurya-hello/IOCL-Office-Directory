import React, { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// Employee login form with similar structure to AdminLogin but for employees
function EmployeeLogin({
  email,
  setEmail,
  password,
  setPassword,
  setIsHeAdmin,
  error,
  loading,
  handleButtonClick,
  onForgotPassword,
  onSignUp,
}) {
  // Similar state as AdminLogin
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Login handler with employee-specific API endpoint
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
    setShowError(false);
    setLocalError("");
    // Similar validation as AdminLogin
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/loginEmployee`,
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

      if (!response.ok) {
        setLocalError(data.error || "Login failed");
        setShowError(true);
        throw new Error(data.error || "Login failed");
      }

      localStorage.removeItem("authState");

      localStorage.setItem("authState", JSON.stringify(data));

      navigate("/app/home");
    } catch (error) {
      setLocalError(error.message || "Login failed. Please try again.");
      setShowError(true);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Similar form structure as AdminLogin */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          fontWeight: "bold",
          marginBottom: "2.5rem",
        }}
      >
        Employee Login
      </h2>

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
            setIsHeAdmin(false);
            onForgotPassword();
          }}
        >
          Forgot password?
        </a>
      </div>

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

      {/* Additional sign up link */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <span style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
        </span>
        <a
          href="#"
          style={{
            color: "white",
            fontSize: "0.9rem",
            fontWeight: "bold",
            textDecoration: "none",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e5e5e5")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
          onClick={(e) => {
            e.preventDefault();
            onSignUp();
          }}
        >
          Sign up
        </a>
      </div>

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

export default EmployeeLogin;

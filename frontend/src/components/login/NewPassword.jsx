import React, { useState, useEffect } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Component for setting a new password during reset flow
function NewPassword({ empId, onPasswordReset, actionType }) {
  const [newPassword, setNewPassword] = useState(""); // New password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input
  const [error, setError] = useState(""); // Error message
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Confirm password visibility
  const [isResetting, setIsResetting] = useState(false); // Loading state for reset operation

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0, // Strength score (0-4)
    label: "Weak", // Strength label
    color: "#ff5252", // Color indicator
  });

  // Calculates password strength based on complexity
  const calculatePasswordStrength = (password) => {
    let score = 0;
    // Length recommendation (not requirement)
    if (password.length >= 8) score += 1;
    // Contains number
    if (/\d/.test(password)) score += 1;
    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    // Contains both lowercase and uppercase
    if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) score += 1;

    let label, color;
    switch (score) {
      case 0:
        label = "Weak";
        color = "#ff5252";
        break;
      case 1:
        label = "Fair";
        color = "#ffb142";
        break;
      case 2:
        label = "Good";
        color = "#feca57";
        break;
      case 3:
        label = "Strong";
        color = "#1dd1a1";
        break;
      case 4:
        label = "Very Strong";
        color = "#2ecc71";
        break;
      default:
        label = "Weak";
        color = "#ff5252";
    }

    return { score, label, color };
  };

  // Updates password strength when password changes
  useEffect(() => {
    if (newPassword) {
      setPasswordStrength(calculatePasswordStrength(newPassword));
    } else {
      setPasswordStrength({
        score: 0,
        label: "Weak",
        color: "#ff5252",
      });
    }
  }, [newPassword]);

  // Handles password reset submission
  const handleSubmit = async () => {
    setIsResetting(true);
    // Validation checks
    if (!newPassword || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // API call to reset password
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/forgotPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empId: empId,
            newPassword: newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIsResetting(false);
        throw new Error(data.message || "Password reset failed");
      }

      setIsResetting(false);
      setError("");
      onPasswordReset();
    } catch (error) {
      setError(error.message || "Failed to reset password. Please try again.");
    }
  };
  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // Toggle confirm password visibility
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    /* JSX for new password form */
    <>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          fontWeight: "bold",
          marginBottom: "2.5rem",
        }}
      >
        Set New Password
      </h2>

      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            if (error) setError("");
          }}
          style={{
            width: "100%",
            paddingRight: "3.5rem",
            paddingLeft: "0.75rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            backgroundColor: "transparent",
            borderBottom: `1px solid ${error ? "red" : "white"}`,
            color: "white",
            outline: "none",
            fontSize: "1.1rem",
          }}
        />
        <InputAdornment
          position="end"
          style={{
            position: "absolute",
            right: "0.5rem",
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

      {/* Password Strength Indicator */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{
              color: "rgba(255, 255, 255, 0.75)",
              fontSize: "1rem",
            }}
          >
            Password Strength:{" "}
            <strong style={{ color: passwordStrength.color }}>
              {passwordStrength.label}
            </strong>
          </span>
          <div
            style={{
              display: "flex",
              gap: "0.25rem",
              width: "60%",
              alignItems: "center",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "4px",
                  flex: 1,
                  backgroundColor:
                    i <= passwordStrength.score
                      ? passwordStrength.color
                      : "rgba(255, 255, 255, 0.1)",
                  borderRadius: "2px",
                  transition: "background-color 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            color: "rgba(255, 255, 255, 0.66)",
            fontSize: "0.9rem",
            lineHeight: "1.4",
          }}
        >
          {newPassword.length > 0 && (
            <>
              {passwordStrength.score < 2 &&
                "Recommendation: Use at least 8 characters"}
              {passwordStrength.score >= 2 &&
                passwordStrength.score < 3 &&
                "Recommendation: Add numbers or special characters"}
              {passwordStrength.score >= 3 &&
                passwordStrength.score < 4 &&
                "Recommendation: Mix uppercase and lowercase letters"}
              {passwordStrength.score === 4 &&
                "Great! Your password is very strong"}
            </>
          )}
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "0.5rem" }}>
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError("");
          }}
          style={{
            width: "100%",
            paddingRight: "3.5rem",
            paddingLeft: "0.75rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            backgroundColor: "transparent",
            borderBottom: `1px solid ${error ? "red" : "white"}`,
            color: "white",
            outline: "none",
            fontSize: "1.1rem",
          }}
        />
        <InputAdornment
          position="end"
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowConfirmPassword}
            edge="end"
            style={{ color: "white" }}
          >
            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      </div>

      {error && (
        <div
          style={{
            color: "red",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isResetting}
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
          fontSize: "1.15rem",
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
        {isResetting ? "Resetting..." : "Reset Password"}
      </button>
    </>
  );
}

export default NewPassword;

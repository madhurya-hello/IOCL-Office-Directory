import React, { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";

// Password reset form with OTP generation
function ForgotPassword({
  email, // Email state
  setEmail, // Email setter
  isHeAdmin, // Admin/employee flag
  empId, // Employee ID (optional)
  setEmpId, // Employee ID setter
  isGenerating, // Loading state
  loading,
  handleGenerateOTP, // OTP generation handler
  onBackToLogin, // Back to login handler
  actionType, // "forgot" or "create" password
  showToastMessage,
}) {
  const [emailError, setEmailError] = useState("");
  // Validate email and trigger OTP generation
  const handleGenerateOTPClick = () => {
    // Email validation
    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    
    setEmailError("");
    handleGenerateOTP();
  };

  return (
    <>
      {/* Dynamic header based on action type */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          fontWeight: "bold",
          marginBottom: "2.5rem",
        }}
      >
        {actionType === "forgot" ? "Reset Password" : "Create Password"}
      </h2>

      {/* Email input with validation */}
      <div style={{ position: "relative", marginBottom: "0.5rem" }}>
        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          required
          style={{
            width: "100%",
            paddingRight: "2.5rem",
            paddingLeft: "0.75rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            backgroundColor: "transparent",
            borderBottom: `1px solid ${emailError ? "red" : "white"}`,
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

      {/* Email validation error */}
      {emailError && (
        <div
          style={{
            color: "red",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            marginTop: "0.5rem",
          }}
        >
          {emailError}
        </div>
      )}

      {/* Generate OTP button */}
      <button
        type="button"
        onClick={handleGenerateOTPClick}
        disabled={isGenerating}
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
        {isGenerating ? "Generating..." : "Generate OTP"}
      </button>

      {/* Back to login link */}
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
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
            onBackToLogin();
          }}
        >
          Back to login
        </a>
      </div>
    </>
  );
}

export default ForgotPassword;

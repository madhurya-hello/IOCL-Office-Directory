import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import EmployeeLogin from "./EmployeeLogin";
import ForgotPassword from "./ForgotPassword";
import { motion, AnimatePresence } from "framer-motion";
import OTP from "./OTP";
import NewPassword from "./NewPassword";

// Main login card component that handles different login flows (admin/employee)
function LoginCard({
  email, // Email state from parent
  setEmail, // Email setter from parent
  password, // Password state from parent
  setPassword, // Password setter from parent
  error, // Error message from parent
  loading, // Loading state from parent
  handleButtonClick, // Login handler from parent
}) {
  // State management for different authentication flows
  const [userType, setUserType] = useState("admin"); // Tracks admin/employee selection
  const [direction, setDirection] = useState("left"); // Animation direction for toggle
  const [showForgotPassword, setShowForgotPassword] = useState(false); // Forgot password flow control
  const [actionType, setActionType] = useState(""); // Tracks current action (login/forgot/signup)
  const [showOTP, setShowOTP] = useState(false); // OTP verification screen control
  const [showToast, setShowToast] = useState(false); // Toast notification visibility
  const [toastMessage, setToastMessage] = useState(""); // Toast message content
  const [showNewPassword, setShowNewPassword] = useState(false); // New password screen control

  // User type specific states
  const [isHeAdmin, setIsHeAdmin] = useState(false); // Tracks if user is admin
  const [empId, setEmpId] = useState(""); // Stores employee ID during auth flow
  const [isGenerating, setIsGenerating] = useState(false); // Loading state for OTP generation

  // Handles successful password reset
  const handlePasswordReset = () => {
    showToastMessage(`Password successfully reset`);

    setShowNewPassword(false);
    setShowOTP(false);
    setShowForgotPassword(false);
  };

  // Toggles between admin and employee login
  const handleToggle = (type) => {
    setDirection(type === "admin" ? "left" : "right");
    setUserType(type);
  };
  // Initiates forgot password flow
  const handleForgotPasswordClick = (type) => {
    setActionType(type);
    setShowForgotPassword(true);
  };
  // Displays toast message with auto-hide
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Generates and sends OTP to user's email
  const handleGenerateOTP = async () => {
    setIsGenerating(true);

    if (!email.trim()) return;

    try {
      const endpoint = isHeAdmin
        ? `${import.meta.env.VITE_API_BASE_URL}/api/employees/sendAdminOTP`
        : `${import.meta.env.VITE_API_BASE_URL}/api/employees/sendEmployeeOTP`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsGenerating(false);
        throw new Error(data.error || "Failed to send OTP");
      }

      setIsGenerating(false);

      setEmpId(data.empId);

      setShowOTP(true);
      setShowForgotPassword(false);
      showToastMessage(`OTP sent to ${email}`);
    } catch (error) {
      showToastMessage(error.message || "Failed to send OTP");
    }
  };

  // Resends OTP code
  const handleResendCode = async () => {
    setIsGenerating(true);

    if (!email.trim()) return;

    try {
      const endpoint = isHeAdmin
        ? `${import.meta.env.VITE_API_BASE_URL}/api/employees/sendAdminOTP`
        : `${import.meta.env.VITE_API_BASE_URL}/api/employees/sendEmployeeOTP`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsGenerating(false);
        throw new Error(data.error || "Failed to send OTP");
      }

      setIsGenerating(false);

      setEmpId(data.empId);

      setShowOTP(true);
      setShowForgotPassword(false);
      showToastMessage(`OTP sent to ${email}`);
    } catch (error) {
      showToastMessage(error.message || "Failed to send OTP");
    }
  };

  // Navigation handlers
  const handleBackToForgotPassword = () => {
    setShowOTP(false);
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
  };

  // Animation variants for the login card
  const variants = {
    enter: (direction) => ({
      x: direction === "left" ? -300 : 300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "left" ? 300 : -300,
      opacity: 0,
    }),
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    /* JSX for the login card */
    <div
      style={{
        width: "600px",
        height: "580px",
        minHeight: "450px",
        padding: "2.5rem",
        color: "white",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "1rem",
        backdropFilter: "blur(20px)",
        boxShadow: "10px 10px 70px 10px rgba(0, 0, 0, 0.7)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "15px 15px 80px 18px rgba(0,0,0,0.8)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow =
          "10px 10px 70px 10px rgba(0, 0, 0, 0.7)";
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
      }}
    >
      {/* Toast Notification */}
      {showToast && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            animation: `${
              showToast ? "fadeIn 0.3s ease-in-out" : "fadeOut 0.3s ease-in-out"
            }`,
          }}
        >
          <span style={{ marginRight: "8px" }}>✅</span>
          {toastMessage}
        </div>
      )}

      {/* Main Content */}
      {!showForgotPassword && !showOTP && !showNewPassword ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "9999px",
                  padding: "0.25rem",
                  position: "relative",
                }}
              >
                <button
                  onClick={() => handleToggle("admin")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    backgroundColor:
                      userType === "admin" ? "white" : "transparent",
                    color: userType === "admin" ? "black" : "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                  }}
                >
                  Admin
                </button>
                <button
                  onClick={() => handleToggle("employee")}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "9999px",
                    backgroundColor:
                      userType === "employee" ? "white" : "transparent",
                    color: userType === "employee" ? "black" : "white",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    fontSize: "0.9rem",
                  }}
                >
                  Employee
                </button>
              </div>
            </div>
          </div>

          <div style={{ position: "relative", height: "100%" }}>
            <AnimatePresence custom={direction} mode="wait">
              {userType === "admin" ? (
                <motion.div
                  key="admin"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "keyframes",
                    values: [0, 50, 100],
                    duration: 0.2,
                    delay: 0.2,
                  }}
                  style={{ position: "absolute", width: "100%" }}
                >
                  <AdminLogin
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    setIsHeAdmin={setIsHeAdmin}
                    error={error}
                    loading={loading}
                    handleButtonClick={() => handleButtonClick("admin")}
                    onForgotPassword={() => handleForgotPasswordClick("forgot")}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="employee"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "keyframes",
                    values: [0, 50, 100],
                    duration: 0.2,
                    delay: 0.2,
                  }}
                  style={{ position: "absolute", width: "100%" }}
                >
                  <EmployeeLogin
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    setIsHeAdmin={setIsHeAdmin}
                    error={error}
                    loading={loading}
                    handleButtonClick={() => handleButtonClick("employee")}
                    onForgotPassword={() => handleForgotPasswordClick("forgot")}
                    onSignUp={() => handleForgotPasswordClick("signup")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          {showForgotPassword && (
            <motion.div
              key="forgotPassword"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ForgotPassword
                email={email}
                setEmail={setEmail}
                isHeAdmin={isHeAdmin}
                empId={empId}
                setEmpId={setEmpId}
                isGenerating={isGenerating}
                loading={loading}
                handleGenerateOTP={handleGenerateOTP}
                onBackToLogin={handleBackToLogin}
                actionType={actionType}
              />
            </motion.div>
          )}

          {showOTP && (
            <motion.div
              key="otp"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <OTP
                email={email}
                empId={empId}
                onBackToLogin={handleBackToForgotPassword}
                onResendCode={handleResendCode}
                actionType={actionType}
                onVerify={() => {
                  setShowOTP(false);
                  setShowForgotPassword(false);
                  setShowNewPassword(true);
                }}
              />
            </motion.div>
          )}

          {showNewPassword && (
            <motion.div
              key="newPassword"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <NewPassword
                empId={empId}
                onPasswordReset={handlePasswordReset}
                actionType={actionType}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}

export default LoginCard;

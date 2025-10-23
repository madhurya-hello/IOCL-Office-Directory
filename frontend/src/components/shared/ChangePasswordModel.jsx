import React, { useState } from "react";
import { Alert, AlertTitle, IconButton, Slide } from "@mui/material"; // Material-UI components
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Success icon
import Visibility from "@mui/icons-material/Visibility"; // Show password icon
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Hide password icon
import { motion } from "framer-motion"; // Animation library
import { toast, ToastContainer } from "react-toastify"; // Notification library
import "react-toastify/dist/ReactToastify.css"; // Toastify styles

// Modal component for changing user password
const ChangePasswordModal = ({ onClose, email }) => {
  // Retrieve current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("authState"));

  // State for form inputs and UI control
  const [currentPwd, setCurrentPwd] = useState(""); // Current password input
  const [newPwd, setNewPwd] = useState(""); // New password input
  const [confirmPwd, setConfirmPwd] = useState(""); // Confirm new password input
  const [showCurrentPwd, setShowCurrentPwd] = useState(false); // Toggle current password visibility
  const [showNewPwd, setShowNewPwd] = useState(false); // Toggle new password visibility
  const [showConfirmPwd, setShowConfirmPwd] = useState(false); // Toggle confirm password visibility
  const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null); // Error message
  const [success, setSuccess] = useState(null); // Success message (unused in current code)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Success alert visibility

  // Validate new password requirements
  const validate = () => {
    return {
      hasUpper: /[A-Z]/.test(newPwd), // Check for uppercase letter
      hasNumber: /\d/.test(newPwd), // Check for number
      hasLength: newPwd.length >= 8, // Check for minimum length
      matchesConfirm: newPwd === confirmPwd, // Check if passwords match
    };
  };

  // Calculate password strength based on validations
  const calculateStrength = () => {
    if (newPwd.length === 0) return 0;

    const validations = validate();
    let strength = 0;

    if (validations.hasLength) strength += 33;
    if (validations.hasUpper) strength += 33;
    if (validations.hasNumber) strength += 34;

    return Math.min(strength, 100); // Cap strength at 100%
  };

  // Handle password change API call
  const handlePasswordChange = async () => {
    if (!validate().matchesConfirm) return; // Exit if passwords don't match

    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/changePassword?id=${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            current: currentPwd,
            newPassword: newPwd,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast.success("Password changed successfully!"); // Show success notification
    } catch (err) {
      setError(err.message || "An error occurred while changing password");
      toast.error(err.message || "Something went wrong"); // Show error notification
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Get validation results and form validity
  const strength = calculateStrength();
  const validations = validate();
  const passwordsMatch = validations.matchesConfirm;
  const isFormValid = currentPwd && newPwd && confirmPwd && passwordsMatch;

  // Determine password strength color
  const getStrengthColor = () => {
    if (strength < 40) return "#ff4444"; // Weak
    if (strength < 70) return "#ffbb33"; // Good
    return "#00C851"; // Strong
  };

  // Close modal when clicking overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent modal close when clicking inside
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Notification container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 1001 }} // Ensure notifications appear above modal
      />

      {/* Modal overlay */}
      <div style={styles.overlay} onClick={handleOverlayClick}>
        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, y: 18 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          style={styles.modal}
          onClick={handleModalClick}
        >
          <h2 style={styles.title}>Change Password</h2>
          <p style={styles.subtitle}>
            Update password for enhanced account security.
          </p>
          {/* Current password input */}
          <div style={styles.inputGroup}>
            <label>Current Password *</label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showCurrentPwd ? "text" : "password"}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                style={styles.input}
                disabled={isLoading}
              />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                edge="end"
                style={styles.eyeButton}
                disabled={isLoading}
              >
                {showCurrentPwd ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
          </div>
          {/* New password input */}
          <div style={styles.inputGroup}>
            <label>New Password *</label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showNewPwd ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                style={styles.input}
              />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowNewPwd(!showNewPwd)}
                edge="end"
                style={styles.eyeButton}
              >
                {showNewPwd ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
          </div>
          {/* Confirm password input */}
          <div style={styles.inputGroup}>
            <label>Confirm New Password *</label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showConfirmPwd ? "text" : "password"}
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                style={styles.input}
              />
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                edge="end"
                style={styles.eyeButton}
              >
                {showConfirmPwd ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </div>
            {!passwordsMatch && confirmPwd && (
              <p style={styles.errorText}>Passwords do not match</p>
            )}
          </div>
          {/* Password strength and rules */}
          <div style={styles.rules}>
            <div style={styles.strengthBarContainer}>
              <div
                style={{
                  ...styles.strengthBar,
                  width: `${strength}%`,
                  backgroundColor: getStrengthColor(),
                }}
              />
            </div>
            <p
              style={{
                color: strength === 0 ? "inherit" : getStrengthColor(),
                marginTop: "4px",
              }}
            >
              {strength === 0
                ? "Password strength"
                : strength < 40
                ? "Weak password"
                : strength < 70
                ? "Good password"
                : "Strong password"}
            </p>
            <p style={{ marginTop: "18px" }}>For best security, include:</p>
            <ul style={styles.ul}>
              <li style={{ color: validations.hasUpper ? "green" : "gray" }}>
                ✔ At least 1 uppercase
              </li>
              <li style={{ color: validations.hasNumber ? "green" : "gray" }}>
                ✔ At least 1 number
              </li>
              <li style={{ color: validations.hasLength ? "green" : "gray" }}>
                ✔ At least 8 characters
              </li>
            </ul>
          </div>
          {/* Action buttons */}
          <div style={styles.actions}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={styles.discard}
              onClick={onClose}
              disabled={isLoading}
            >
              Discard
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                ...styles.apply,
                opacity: !isFormValid ? 0.6 : 1,
                cursor: !isFormValid ? "not-allowed" : "pointer",
              }}
              onClick={handlePasswordChange}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Processing..." : "Apply Changes"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Inline styles for the modal
const styles = {
  errorText: {
    fontSize: "15px",
    marginTop: "4px",
    marginBottom: "15px",
  },
  successText: {
    color: "#00C851",
    fontSize: "15px",
    marginTop: "4px",
    marginBottom: "12px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    cursor: "default",
  },
  modal: {
    backgroundColor: "white",
    padding: "2.5rem 3rem",
    borderRadius: "1.8rem",
    width: "40vw",
    boxShadow: "0 0 20px rgba(0,0,0,0.2)", // Shadow for depth
    fontFamily: "sans-serif",
    cursor: "default",
  },
  title: { marginBottom: "8px", fontSize: "1.8rem" },
  subtitle: { color: "#666", fontSize: "1rem", marginBottom: "26px" },
  inputGroup: { marginBottom: "19px" },
  passwordInputContainer: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginTop: "4px",
    paddingRight: "40px", // Space for eye button
  },
  eyeButton: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    padding: "10px",
  },
  strengthBarContainer: {
    height: "7px",
    backgroundColor: "#e0e0e0",
    borderRadius: "3px",
    marginBottom: "4px",
    overflow: "hidden",
  },
  strengthBar: {
    height: "100%",
    transition: "width 0.3s ease, background-color 0.3s ease",
  },
  rules: { fontSize: "15px", marginBottom: "12px" },
  ul: { paddingLeft: "20px", margin: 0 },
  errorText: {
    color: "#ff4444",
    fontSize: "15px",
    marginTop: "4px",
    marginBottom: 0,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  discard: {
    background: "white",
    color: "#333",
    border: "1px solid #ccc",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  apply: {
    background: "#3366FF",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    opacity: 1,
    transition: "opacity 0.3s ease",
  },
  "apply:disabled": {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default ChangePasswordModal;

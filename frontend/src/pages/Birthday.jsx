import React, { useState, useEffect } from "react";
import Calendar from "../components/birthday/Calender"; // Calendar component for displaying birthdays
import EmpPage from "../components/shared/EmpPage"; // Employee details page component
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import { FiX } from "react-icons/fi"; // Close icon

// Component for displaying a birthday calendar with employee details overlay
const Birthday = () => {
  // State for selected employee and overlay visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeOverlay, setShowEmployeeOverlay] = useState(false);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle employee click to show overlay
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeOverlay(true);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  // Close overlay and reset state
  const closeOverlay = () => {
    setShowEmployeeOverlay(false);
    setSelectedEmployee(null);
    document.body.style.overflow = "auto"; // Restore background scrolling
  };

  return (
    <div style={styles.container}>
      {/* Calendar and Employee Details Section */}
      <div style={styles.content}>
        <div style={styles.calendarContainer}>
          <Calendar onEmployeeClick={handleEmployeeClick} />
        </div>
      </div>

      {/* Employee Popup Overlay */}
      {showEmployeeOverlay && selectedEmployee && (
        <div style={styles.overlay}>
          <motion.div
            initial={{ scale: 0.9, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            style={styles.employeeCard}
          >
            <button
              onClick={closeOverlay}
              style={styles.closeButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 0, 0, 0.1)";
                e.currentTarget.style.color = "rgb(255, 255, 255)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.46)";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiX size={20} />
            </button>
            <EmpPage employee={selectedEmployee} allowExpand={false} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "rgb(210, 229, 247)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    boxSizing: "border-box",
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    padding: "1rem",
    borderRadius: "20px",
    maxWidth: "99vw",
    width: "100%",
  },
  calendarContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1000,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)",
  },
  employeeCard: {
    position: "relative",
    width: "80%",
    maxWidth: "90rem",
    height: "88%",
    backgroundColor: "white",
    borderRadius: "29px",
    boxShadow: "7px 10px 25px rgba(0, 0, 0, 0.46)",
    overflow: "hidden",
  },
  closeButton: {
    position: "absolute",
    top: "1.5rem",
    right: "1.5rem",
    background: "rgba(255, 255, 255, 0.46)",
    border: "none",
    borderRadius: "50%",
    width: "2.5rem",
    height: "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 1001,
    transition: "all 0.2s ease",
    color: "#555",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

export default Birthday;

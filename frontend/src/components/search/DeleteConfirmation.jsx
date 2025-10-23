// Import necessary dependencies from React and libraries
import React, { useState } from "react"; // React for building UI, useState for managing component state
import { FiX } from "react-icons/fi"; // Feather icon for close button
import Alert from "@mui/material/Alert"; // Material-UI Alert component for success/error messages
import AlertTitle from "@mui/material/AlertTitle"; // Material-UI AlertTitle for alert titles
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Material-UI icon for success alerts
import Slide from "@mui/material/Slide"; // Material-UI Slide for alert animation
import { motion } from "framer-motion"; // Framer Motion for animations



// Define the DeleteConfirmation component, accepting props for configuration
const DeleteConfirmation = ({ employee, onClose, onConfirm }) => {
  // State to track deletion process
  const [isDeleting, setIsDeleting] = useState(false); // Indicates if deletion is in progress
  const [error, setError] = useState(null); // Stores any error messages
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Controls success alert visibility
  const [showOverlay, setShowOverlay] = useState(false); // Controls overlay visibility during deletion



  // Function to handle deletion confirmation
  const handleConfirm = async () => {
    setShowOverlay(true); // Show overlay to indicate processing
    setIsDeleting(true); // Set deletion state to true
    setError(null); // Clear any previous errors

    try {
      // Send PUT request to move employee to recycle bin
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/moveToRecycleBin?id=${employee.id}`,
        {
          method: "PUT", // Use PUT method for updating employee status
          headers: {
            "Content-Type": "application/json", // Specify JSON content type
          },
        }
      );

      // Check if request was successful
      if (!response.ok) {
        throw new Error("Failed to delete employee"); // Throw error if response is not OK
      }

      // Show success alert after a short delay
      setTimeout(() => {
        setShowSuccessAlert(true);
      }, 1000);

      // Reload page after deletion (consider replacing with state update)
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message); // Store error message
      setShowOverlay(false); // Hide overlay
      setIsDeleting(false); // Reset deletion state
    }
  };


  
  // Render the component
  return (
    <>
      {/* Overlay during deletion */}
      {showOverlay && (
        <div
          style={{
            position: "fixed", // Cover entire screen
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white
            zIndex: 2200, // High z-index to appear above other elements
            pointerEvents: "auto", // Prevent interaction
            cursor: "wait", // Show loading cursor
          }}
        />
      )}

      {/* Success alert for successful deletion */}
      {showSuccessAlert && (
        <Slide direction="up" in={showSuccessAlert} mountOnEnter unmountOnExit>
          <div
            style={{
              position: "fixed", // Position at bottom center
              bottom: "20px",
              left: "42%",
              transform: "translateX(-50%)", // Center horizontally
              zIndex: 2201, // Above overlay
              width: "auto",
              minWidth: "400px", // Minimum width for readability
            }}
          >
            <Alert
              severity="success" // Success type alert
              icon={<CheckCircleIcon fontSize="inherit" />} // Success icon
              onClose={() => setShowSuccessAlert(false)} // Hide alert when closed
              style={{
                padding: "10px", // Comfortable padding
                fontSize: "1.2rem", // Larger text
              }}
            >
              <AlertTitle>Success</AlertTitle> // Alert title Employee Deleted
              Successfully // Alert message
            </Alert>
          </div>
        </Slide>
      )}

      {/* Confirmation modal */}
      <div
        style={{
          position: "fixed", // Cover entire screen
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex", // Center content
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2000, // High z-index for modal
        }}
      >
        {/* Backdrop for modal */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
            backdropFilter: "blur(5px)", // Blur effect
            zIndex: 2001, // Below modal content
          }}
          onClick={isDeleting ? undefined : onClose} // Close on click unless deleting
        />

        {/* Animated modal container */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} // Start small and transparent
          animate={{ scale: 1, opacity: 1 }} // Animate to full size and opaque
          transition={{
            type: "spring", // Spring animation
            stiffness: 400, // Stiffness for bounce
            damping: 20, // Damping for smoothness
          }}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0)", // Transparent background
            borderRadius: "12px", // Rounded corners
            padding: "2rem", // Padding around content
            width: "400px", // Fixed width
            maxWidth: "90%", // Responsive max width
            zIndex: 2002, // Above backdrop
          }}
        >
          {/* Modal content */}
          <div
            style={{
              backgroundColor: "white", // White background
              borderRadius: "12px", // Rounded corners
              padding: "2rem", // Inner padding
              width: "400px", // Fixed width
              maxWidth: "90%", // Responsive max width
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", // Shadow for depth
              zIndex: 2002, // Ensure above backdrop
            }}
          >
            {/* Header section */}
            <div
              style={{
                display: "flex", // Flexbox for layout
                alignItems: "center", // Vertically center
                position: "relative", // For positioning close button
                marginBottom: "1.5rem", // Space below
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem", // Title size
                  fontWeight: "700", // Bold text
                  color: "#333", // Dark gray color
                  textAlign: "center", // Center text
                  flex: 1, // Take available space
                }}
              >
                Confirm // Modal title
              </h2>
              {/* Close button */}
              {!isDeleting && (
                <div style={{ position: "absolute", right: 0 }}>
                  <button
                    onClick={onClose} // Trigger onClose
                    style={{
                      background: "none", // No background
                      border: "none", // No border
                      cursor: "pointer", // Pointer cursor
                      fontSize: "1.5rem", // Large icon
                      color: "#6b7280", // Gray color
                    }}
                  >
                    <FiX /> // Feather close icon
                  </button>
                </div>
              )}
            </div>

            {/* Confirmation message */}
            <p style={{ marginBottom: "2rem", fontSize: "1.1rem" }}>
              Are you sure you want to delete {employee.name}? // Display
              employee name
            </p>

            {/* Error message if deletion fails */}
            {error && (
              <p style={{ color: "#ef4444", marginBottom: "1rem" }}>
                Error: {error} // Show error in red
              </p>
            )}

            {/* Action buttons */}
            {true ? (
              <div
                style={{
                  display: "flex", // Flexbox for buttons
                  justifyContent: "flex-end", // Align right
                  gap: "1rem", // Space between buttons
                }}
              >
                {/* Cancel button */}
                <button
                  onClick={onClose} // Trigger onClose
                  disabled={isDeleting} // Disable during deletion
                  style={{
                    padding: "0.5rem 1rem", // Padding
                    borderRadius: "6px", // Rounded corners
                    border: "1px solid #d1d5db", // Gray border
                    backgroundColor: "white", // White background
                    color: "#374151", // Dark gray text
                    fontWeight: "500", // Medium bold
                    cursor: "pointer", // Pointer cursor
                    opacity: isDeleting ? 0.7 : 1, // Dim when disabled
                  }}
                >
                  No // Button label
                </button>
                {/* Confirm button */}
                <button
                  onClick={handleConfirm} // Trigger handleConfirm
                  disabled={isDeleting} // Disable during deletion
                  style={{
                    padding: "0.5rem 1rem", // Padding
                    borderRadius: "6px", // Rounded corners
                    border: "none", // No border
                    backgroundColor: "#ef4444", // Red background
                    color: "white", // White text
                    fontWeight: "500", // Medium bold
                    cursor: "pointer", // Pointer cursor
                    opacity: isDeleting ? 0.7 : 1, // Dim when disabled
                  }}
                >
                  {isDeleting ? "Deleting..." : "Yes"} // Dynamic label
                </button>
              </div>
            ) : (
              // Fallback loading state (never used due to constant true condition)
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "1rem",
                  color: "#4b5563",
                  fontStyle: "italic",
                }}
              >
                Deleting... // Loading message
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Export the component for use in other parts of the application
export default DeleteConfirmation;

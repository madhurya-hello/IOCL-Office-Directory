import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion"; // Library for animations
import axios from "axios"; // Library for making HTTP requests
import { CircularProgress } from "@mui/material"; // Material-UI component for loading spinner
import { toast, ToastContainer } from "react-toastify"; // Notification library
import {
  FiUpload,
  FiX,
  FiTrash2,
  FiFileText,
  FiCheck,
  FiDownload,
} from "react-icons/fi"; // Icons for UI elements

// Component for handling file uploads with a modal interface
const ImportCard = ({ onClose }) => {
  // State and ref hooks
  const fileInputRef = useRef(null); // Reference to the hidden file input element
  const [files, setFiles] = useState([]); // State to store uploaded files
  const [isDragging, setIsDragging] = useState(false); // State for drag-and-drop highlight
  const [isUploading, setIsUploading] = useState(false); // State for upload in progress
  const MAX_FILE_SIZE = 120 * 1024; // Max file size limit (120KB)

  // Simulates file upload progress for UI feedback
  const simulateUpload = (file) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id
            ? { ...f, progress: progress > 100 ? 100 : progress }
            : f
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id ? { ...f, status: "done" } : f
          )
        );
      }
    }, 200); // Update progress every 200ms
  };

  // Handles the actual file upload to the server
  const handleUploadComplete = async () => {
    if (files.length === 0) return; // Exit if no files to upload

    try {
      setIsUploading(true); // Set uploading state
      const formData = new FormData(); // Create FormData for file upload
      files.forEach((file) => {
        formData.append("file", file.file); // Append each file to FormData
      });

      // Send POST request to server
      const response = await axios.post(
        "http://localhost:8080/api/employees/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type for file upload
          },
        }
      );

      toast.success("File uploaded successfully!"); // Show success notification
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.message || "Failed to upload file"); // Show error notification
    } finally {
      setIsUploading(false); // Reset uploading state
    }
  };

  // Processes selected or dropped files
  const handleFileUpload = (selected) => {
    if (files.length > 0) {
      toast.warning("Note: Only one file can be uploaded at a time"); // Warn if trying to upload multiple files
      return;
    }

    // Check for oversized files
    const oversizedFiles = selected.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      toast.warning("File must be under 120KB"); // Warn if file exceeds size limit
      return;
    }

    // Create file objects with metadata
    const newFiles = selected.map((file) => ({
      id: Date.now() + Math.random(), // Unique ID for each file
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    }));

    setFiles((prev) => [...prev, ...newFiles]); // Add new files to state
    newFiles.forEach(simulateUpload); // Simulate upload for each file
  };

  // Handles file selection via input
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files); // Convert FileList to array
    const validFiles = selectedFiles.filter(
      (file) => file.name.endsWith(".xlsx") // Filter for .xlsx files only
    );
    handleFileUpload(validFiles); // Process valid files
  };

  // Handles file drop event
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false); // Reset drag state
    const droppedFiles = Array.from(event.dataTransfer.files); // Convert dropped files to array
    const validFiles = droppedFiles.filter(
      (file) => file.name.endsWith(".xlsx") // Filter for .xlsx files only
    );
    handleFileUpload(validFiles); // Process valid files
  };

  // Handles drag over event for drag-and-drop
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true); // Highlight drop zone
  };

  // Handles drag leave event
  const handleDragLeave = () => {
    setIsDragging(false); // Remove drop zone highlight
  };

  // Removes a file from the upload list
  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id)); // Filter out file by ID
  };

  // Checks if all files are uploaded
  const allUploaded =
    files.length > 0 && files.every((f) => f.status === "done");

  return (
    // Modal overlay
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // High z-index to ensure modal is on top
      }}
    >
      {/* Modal content */}
      <motion.div
        initial={{ scale: 0.99, y: 9 }} // Initial animation state
        animate={{ scale: 1, y: 0 }} // Final animation state
        transition={{ duration: 0.3 }} // Animation duration
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "100rem",
          padding: "3rem",
          position: "relative",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.36)", // Shadow for depth
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          height: "100%",
          maxHeight: "60rem",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "-4rem",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "#1e40af",
              margin: 0,
              textAlign: "center",
            }}
          >
            Import Excel
          </h2>

          {/* Close button */}
          <motion.button
            whileHover={{
              scale: 1.12,
              backgroundColor: "rgb(248, 168, 168)",
              color: "rgb(0,0,0)",
            }}
            whileFocus={{
              scale: 1.1,
              backgroundColor: "rgb(185, 183, 183)",
              color: "white",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "rgb(0,0,0)",
              backgroundColor: "rgba(202, 201, 201, 0.36)",
              padding: "0.6rem",
              borderRadius: "50%",
              transition: "all 0.1s",
              position: "absolute",
              right: "0",
            }}
            transition={{
              backgroundColor: { duration: 0.1 },
            }}
          >
            <FiX />
          </motion.button>
        </div>

        {/* Warning and template download section */}
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "1rem",
            marginTop: "4rem",
            fontSize: "1.3rem",
          }}
        >
          <p style={{ margin: 0, fontWeight: 500 }}>
            To avoid database error, please use the given template
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <a
              href="/assets/SearchUploadTemplate.xlsx"
              download="Employee_Data_Template.xlsx"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#b91c1c",
                textDecoration: "none",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
                e.currentTarget.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
                e.currentTarget.style.opacity = "1";
              }}
            >
              <FiDownload style={{ transition: "transform 0.2s" }} />
              Download the template
            </a>
          </div>
        </div>

        {/* Main content: Upload and file list sections */}
        <div style={{ display: "flex", gap: "2rem", flex: 1 }}>
          {/* File upload drop zone */}
          <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              flex: 1,
              border: isDragging ? "5px solid #3b82f6" : "5px dashed #d1d5db",
              backgroundColor: isDragging ? "#f0f9ff" : "#ffffff",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "5px dashed #d1d5db",
              alignItems: "center",
              padding: "2rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <FiUpload style={{ fontSize: "3rem", color: "#3b82f6" }} />
            <p
              style={{
                margin: "1rem 0 0.25rem",
                fontWeight: "500",
                fontSize: "1.4rem",
              }}
            >
              Drag and Drop file
            </p>
            <p style={{ marginBottom: "1rem", color: "#6b7280" }}>or</p>
            <button
              style={{
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "0.5rem 1.25rem",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Browse
            </button>
            <p
              style={{
                fontSize: "1rem",
                color: "#9ca3af",
                marginTop: "1rem",
              }}
            >
              *Only .xlsx files are supported
            </p>
            <input
              type="file"
              accept=".xlsx"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </div>

          {/* Uploaded files list */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                marginBottom: "1rem",
              }}
            >
              Uploaded files
            </h3>
            {files.length === 0 ? (
              <p style={{ color: "#9ca3af" }}>No files uploaded yet</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {files.map((f) => (
                  <li
                    key={f.id}
                    style={{
                      backgroundColor: "#f3f4f6",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.75rem",
                          alignItems: "center",
                        }}
                      >
                        <FiFileText
                          style={{ color: "#2563eb", fontSize: "1.25rem" }}
                        />
                        <div>
                          <p style={{ margin: 0, fontWeight: "500" }}>
                            {f.name}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.85rem",
                              color: "#6b7280",
                            }}
                          >
                            {(f.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      {f.status === "done" ? (
                        <FiCheck
                          style={{ color: "#10b981", fontSize: "1.25rem" }}
                        />
                      ) : (
                        <button
                          onClick={() => removeFile(f.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            fontSize: "1.25rem",
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                    {/* Progress bar for uploading files */}
                    {f.status !== "done" && (
                      <div
                        style={{
                          height: "6px",
                          backgroundColor: "#e5e7eb",
                          borderRadius: "4px",
                          marginTop: "0.5rem",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${f.progress}%`,
                            height: "100%",
                            backgroundColor: "#3b82f6",
                            transition: "width 0.3s",
                          }}
                        ></div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Upload button shown when all files are ready */}
        {allUploaded && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={handleUploadComplete}
              disabled={isUploading}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "6px",
                backgroundColor: isUploading
                  ? "rgb(112, 187, 238)"
                  : "rgb(28, 149, 230)",
                color: "white",
                fontWeight: "500",
                border: "none",
                cursor: isUploading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              {isUploading ? (
                <>
                  <div
                    style={{
                      padding: "0rem 0rem",
                      borderRadius: "6px",
                      backgroundColor: "rgba(28, 149, 230, 0)",
                      color: "white",
                      fontWeight: "500",
                      border: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    <CircularProgress
                      size={20}
                      style={{ color: "white", marginRight: "0.5rem" }}
                    />{" "}
                    Processing
                  </div>
                </>
              ) : (
                <div
                  style={{
                    padding: "0rem 1.98rem",
                    borderRadius: "6px",
                    backgroundColor: "rgb(28, 149, 230)",
                    color: "white",
                    fontWeight: "500",
                    border: "none",
                    cursor: "pointer",
                    marginTop: "0.1rem",
                  }}
                >
                  Upload
                </div>
              )}
            </button>
          </div>
        )}
      </motion.div>
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
      />
    </div>
  );
};

export default ImportCard;

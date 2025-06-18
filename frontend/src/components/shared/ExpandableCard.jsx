import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Animation library
import { FaPen, FaSave } from "react-icons/fa"; // Icons for edit and save actions

// Component for displaying expandable card with employee details
const ExpandableCard = ({
  title, // Card title
  content, // Content to display when not expanded
  isExpanded, // Flag for expanded state
  onClick, // Click handler for expansion
  index, // Card index for positioning
  employee, // Employee data
  setEmployee, // Function to update employee data
  isAdmin, // Admin status
}) => {
  // State for editing mode and edited data
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...employee });

  // Inline styles for the card
  const cardStyles = {
    card: {
      display: isExpanded ? "none" : "flex", // Hide when expanded
      flexDirection: "column",
      height: isExpanded ? "800px" : "550px",
      width: isExpanded ? "560px" : "450px",
      backgroundColor: "rgb(55, 88, 161)", // Blue background
      borderRadius: "13px",
      boxShadow: "-1px 0 30px #000", // Shadow for depth
      padding: isExpanded ? "2rem" : "1.5rem",
      position: isExpanded ? "fixed" : "absolute",
      top: isExpanded ? "15%" : "auto",
      left: isExpanded ? "38%" : `${index * 300}px`, // Position based on index
      zIndex: isExpanded ? 1000 : 3 - index, // Higher z-index when expanded
      transition: isExpanded ? "" : "all 0.2s",
      overflowY: "auto",
      cursor: "pointer",
      scale: 1,
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: isExpanded ? "flex-start" : "flex-start",
      position: "relative",
      gap: isExpanded ? "0" : "0.3rem",
    },
    separator: {
      height: "1px",
      backgroundColor: "white",
      margin: isExpanded ? "0 0 0.5rem 0" : "0 0 0.5rem 0",
      width: "100%",
    },
    cardTitle: {
      color: "white",
      fontWeight: "600",
      fontSize: isExpanded ? "2rem" : "1.35rem",
      marginBottom: isExpanded ? "2rem" : "1.5rem",
      textAlign: isExpanded ? "center" : "left",
    },
    cardText: {
      margin: "0.5rem",
      color: "rgb(255, 255, 255)",
      fontSize: isExpanded ? "1.2rem" : "1.2rem",
      lineHeight: isExpanded ? "1.4" : "1.2",
    },
    compactContent: {
      display: "flex",
      flexDirection: "column",
      gap: "0.3rem",
    },
    tableContainer: {
      width: "100%",
      marginBottom: isExpanded ? "2rem" : "0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "0",
    },
    tableRow: {
      borderBottom: "1px solid #2e3033",
    },
    tableCell: {
      padding: "0.8rem 0.5rem",
      color: "#aaa",
      fontSize: "1.1rem",
      textAlign: "left",
    },
    tableHeader: {
      color: "#fff",
      fontWeight: "500",
      paddingBottom: "0.5rem",
    },
    editIcon: {
      position: "absolute",
      top: "10px",
      right: "10px",
      color: "#aaa",
      cursor: "pointer",
      fontSize: "1.2rem",
      zIndex: 1001,
      "&:hover": { color: "#fff" },
    },
    saveButton: {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "8px 16px",
      cursor: "pointer",
      fontSize: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      "&:hover": { backgroundColor: "#0069d9" },
    },
    inputField: {
      backgroundColor: "transparent",
      border: "1px solid #2e3033",
      color: "#fff",
      padding: "5px",
      borderRadius: "4px",
      width: "100%",
    },
  };

  // Handle card click to trigger expansion
  const handleCardClick = (e) => {
    e.stopPropagation();
    if (!isExpanded) {
      onClick();
    }
  };

  // Enable editing mode
  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Save changes (placeholder for API call)
  const handleSaveClick = async (e) => {
    e.stopPropagation();
    try {
      // Placeholder for API call to update employee data
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating employee:", err);
    }
  };

  // Update edited data state
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Render editable cell for editing mode
  const renderEditableCell = (value, field) => {
    return isEditing ? (
      <input
        type="text"
        value={editedData[field] || ""}
        onChange={(e) => handleInputChange(field, e.target.value)}
        style={cardStyles.inputField}
      />
    ) : (
      value
    );
  };

  // Render content based on expansion state and card title
  const renderContent = () => {
    if (!isExpanded) {
      // Compact view when not expanded
      return (
        <div style={cardStyles.compactContent}>
          {content.map((text, i) => (
            <p key={i} style={cardStyles.cardText}>
              {text}
            </p>
          ))}
        </div>
      );
    }

    // Expanded view with table based on card title
    switch (title) {
      case "Personal Details":
        return (
          <div style={cardStyles.tableContainer}>
            <table style={cardStyles.table}>
              <tbody>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>First name*</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("firstName")}
                  </td>
                  <td style={cardStyles.tableCell}>Last name*</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("lastName")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Display name</td>
                  <td style={cardStyles.tableCell} colSpan="3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={`${editedData.firstName} ${editedData.lastName}`}
                        readOnly
                        style={cardStyles.inputField}
                      />
                    ) : (
                      `${editedData.firstName} ${editedData.lastName}`
                    )}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Date of birth</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("birthDate")}
                  </td>
                  <td style={cardStyles.tableCell}>Gender</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("gender")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Blood Group</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("bloodGroup")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "Work Information":
        return (
          <div style={cardStyles.tableContainer}>
            <table style={cardStyles.table}>
              <tbody>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Employee No</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("empNo")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Designation</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("designation")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Division</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("parentDivision")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Function</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("function")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Subgroup</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("subgroup")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Subgroup Code</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("subgroupCode")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Worker Type</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("collarWorker")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Working Hours</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("workingHours")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Work Schedule</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("workSchedule")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "Contact":
        return (
          <div style={cardStyles.tableContainer}>
            <table style={cardStyles.table}>
              <tbody>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Location</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("location")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>City</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("city")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Phone</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("phone")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Email</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("email")}
                  </td>
                </tr>
                <tr style={cardStyles.tableRow}>
                  <td style={cardStyles.tableCell}>Address</td>
                  <td style={cardStyles.tableCell}>
                    {renderEditableCell("address")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return content.map((text, i) => (
          <p key={i} style={cardStyles.cardText}>
            {text}
          </p>
        ));
    }
  };

  return (
    <motion.div
      style={cardStyles.card}
      onClick={handleCardClick}
      whileHover={
        !isExpanded
          ? {
              x: index === 0 ? 0 : index * 15,
              y: -5,
              zIndex: 10,
              scale: 1.07,
              transition: { duration: 0.00001 },
            }
          : {}
      }
    >
      <div style={cardStyles.cardContent}>
        {/* Show edit icon when expanded */}
        {isExpanded && (
          <FaPen style={cardStyles.editIcon} onClick={handleEditClick} />
        )}
        {/* Adjust title for Contact card */}
        <h3 style={cardStyles.cardTitle}>
          {title == "Contact" ? "Contact Information" : title}
        </h3>
         <div style={cardStyles.separator} />
        {renderContent()}
        {/* Show save button when editing */}
        {isExpanded && isEditing && (
          <button style={cardStyles.saveButton} onClick={handleSaveClick}>
            <FaSave /> Save Changes
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ExpandableCard;

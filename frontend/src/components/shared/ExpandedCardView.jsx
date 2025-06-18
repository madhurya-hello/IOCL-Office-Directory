import React, { useState } from "react";
import { FaPen, FaSave } from "react-icons/fa"; // Icons for edit and save actions
import { motion } from "framer-motion"; // Animation library
import axios from "axios"; // HTTP client for API requests
import { useDispatch } from "react-redux"; // Redux dispatch hook
import { toast, ToastContainer } from "react-toastify"; // Notification library

// Component for displaying an expanded card view of employee details
const ExpandedCardView = ({ card, employee, onClose, index, setEmployee }) => {
  const dispatch = useDispatch(); // Redux dispatch for state updates

  // State management
  const [isEditing, setIsEditing] = useState(false); // Editing mode
  const [editedData, setEditedData] = useState({ ...employee }); // Edited employee data
  const [isSaving, setIsSaving] = useState(false); // Saving state

  // Inline styles for the component
  const styles = {
    expandedCard: {
      position: "fixed",
      top: "20%",
      left: "36",
      transform: "translate(-50%, -50%)",
      width: "560px",
      height: "800px",

      backgroundColor: "rgb(55, 88, 161)",
      borderRadius: "13px",
      boxShadow: "-1px 0 30px #000",
      padding: "2rem",
      zIndex: 1000,
      overflowY: "auto",
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "flex-start",
      position: "relative",
    },
    cardTitle: {
      color: "white",
      fontWeight: "300",
      fontSize: "2rem",
      marginBottom: "1.5rem",
      textAlign: "center",
    },

    cardText: {
      margin: "0.5rem 0",
      color: "rgb(255, 255, 255)",
      fontSize: "1.5rem",
      lineHeight: "1.4",
    },
    tableContainer: {
      width: "100%",
      marginBottom: "2rem",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "0",
    },
    tableRow: {
      borderBottom: "1px solid rgba(255, 255, 255, 0.29)",
    },
    tableCell: {
      padding: "0.8rem 0.5rem",
      color: "rgb(255, 255, 255)",
      fontSize: "1.3rem",
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
      "&:hover": {
        color: "#fff",
      },
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
      "&:hover": {
        backgroundColor: "#0069d9",
      },
    },
    inputField: {
      backgroundColor: "transparent",
      border: "1px solid #2e3033",
      color: "#fff",
      padding: "5px",
      borderRadius: "4px",
      width: "100%",
    },
    loadingOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.51)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
      cursor: "wait",
    },
    loadingSpinner: {
      border: "4px solid rgba(0, 0, 0, 0.1)",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      borderLeftColor: "#09f",
      animation: "spin 1s linear infinite",
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(0deg)",
      },
      "100%": {
        transform: "rotate(360deg)",
      },
    },
    alert: {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 2001,
    },
  };
  // Enable editing mode
  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  // Save changes via API and update state
  const handleSaveClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsSaving(true);
    setEmployee(editedData);

    try {
      const updatedData = {
        ...editedData,
        isAdmin: editedData.admin,
      };
      // Update employee data via API
      const response = await axios.put(
        `http://localhost:8080/api/employees/updateEmployee?id=${index}`,
        updatedData
      );

      const updatedEmployee = response.data;
      // Dispatch Redux action to update global state
      dispatch({
        type: "employee/updateEmployee",
        payload: {
          id: index, // or employee.id if that's the correct identifier
          updatedEmployee: response.data,
        },
      });

      setIsEditing(false);
      toast.success("Employee updated successfully");
    } catch (err) {
      console.error("Error updating employee:", err);
      toast.error("Please recheck the data or try again.");
    } finally {
      setIsSaving(false);
    }
  };
  // Update edited data state
  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  // Render editable cell with field-specific placeholders
  const renderEditableCell = (value, field) => {
    return isEditing ? (
      field == "admin" ? (
        <input
          type="text"
          value={editedData[field] || ""}
          placeholder="false"
          onChange={(e) => handleInputChange(field, e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #2e3033",
            color: "#fff",
            padding: "5px",
            borderRadius: "4px",
            width: "100%",
          }}
        />
      ) : field == "status" ? (
        <input
          type="text"
          value={editedData[field] || ""}
          placeholder="active / transferred / retired"
          onChange={(e) => handleInputChange(field, e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #2e3033",
            color: "#fff",
            padding: "5px",
            borderRadius: "4px",
            width: "100%",
          }}
        />
      ) : (
        <input
          type="text"
          value={editedData[field] || ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "1px solid #2e3033",
            color: "#fff",
            padding: "5px",
            borderRadius: "4px",
            width: "100%",
          }}
        />
      )
    ) : (
      value
    );
  };
  // Render content based on card title
  const renderContent = () => {
    switch (card.title) {
      case "Personal Details":
        return (
          <div style={{ width: "100%", marginBottom: "2rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Title*</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.title, "title")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>First name*</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.firstName, "firstName")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Last name*</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.lastName, "lastName")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Display name</td>
                  <td style={styles.tableCell} colSpan="3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={`${editedData.firstName} ${editedData.lastName}`}
                        readOnly
                        style={styles.inputField}
                      />
                    ) : (
                      `${editedData.firstName} ${editedData.lastName}`
                    )}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Date of birth</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.birthDate, "birthDate")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Gender</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.gender, "gender")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Blood Group</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.bloodGroup, "bloodGroup")}
                  </td>
                  <td style={styles.tableCell}></td>
                  <td style={styles.tableCell}></td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Status</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.status, "status")}
                  </td>
                  <td style={styles.tableCell}></td>
                  <td style={styles.tableCell}></td>
                </tr>
                {isEditing && (
                  <tr style={styles.tableRow}>
                    <td style={styles.tableCell}>Admin</td>
                    <td style={styles.tableCell}>
                      {renderEditableCell(editedData.admin, "admin")}
                    </td>
                    <td style={styles.tableCell}></td>
                    <td style={styles.tableCell}></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "Work Information":
        return (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Employee No</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.empNo, "empNo")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Designation</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.designation, "designation")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Division</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(
                      editedData.parentDivision,
                      "parentDivision"
                    )}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Function</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.function, "function")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Subgroup</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.subgroup, "subgroup")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Subgroup Code</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(
                      editedData.subgroupCode,
                      "subgroupCode"
                    )}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Worker Type</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(
                      editedData.collarWorker,
                      "collarWorker"
                    )}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Working Hours</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(
                      editedData.workingHours,
                      "workingHours"
                    )}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Work Schedule</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(
                      editedData.workSchedule,
                      "workSchedule"
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case "Contact":
        return (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <tbody>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Location</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.location, "location")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>City</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.city, "city")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Phone</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.phone, "phone")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Email</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.email, "email")}
                  </td>
                </tr>
                <tr style={styles.tableRow}>
                  <td style={styles.tableCell}>Address</td>
                  <td style={styles.tableCell}>
                    {renderEditableCell(editedData.address, "address")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      default:
        return card.content.map((text, i) => (
          <p
            key={i}
            style={{ margin: "0.5rem 0", color: "#aaa", fontSize: "1.2rem" }}
          >
            {text}
          </p>
        ));
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 1, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      style={styles.expandedCard}
    >
      {/* Loading overlay during save */}
      {isSaving && <div style={styles.loadingOverlay}></div>}

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

      <div style={styles.cardContent}>
        {/* Card title and content */}
        <h3 style={styles.cardTitle}>{card.title}</h3>
        {/* Edit/save button */}
        <div
          style={{
            position: "absolute",
            top: "0rem",
            right: "0rem",
            zIndex: 1001,
          }}
        >
          {isEditing ? (
            <button
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                color: "white",
                border: "none",
                borderRadius: "15px",
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={handleSaveClick}
            >
              <FaSave /> Save
            </button>
          ) : (
            <FaPen
              style={{
                color: "rgb(255, 255, 255)",
                cursor: "pointer",
                fontSize: "1.3rem",
                marginTop: "0.8rem",
              }}
              onClick={handleEditClick}
            />
          )}
        </div>
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default ExpandedCardView;

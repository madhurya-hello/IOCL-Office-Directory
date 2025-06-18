import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi"; // Icon for delete button
import { motion } from "framer-motion"; // Animation library for interactive effects

// Table component to display employee data
const Table = ({
  employees, // List of employee objects
  onEmployeeClick, // Callback for clicking an employee row
  selectMode, // Boolean to enable/disable selection mode
  onEmployeeSelect, // Callback for selecting employees in select mode
  selectedEmployees, // Array of selected employee IDs
  isAdmin, // Boolean to check if user has admin privileges
}) => {
  // State to manage number of visible employees
  const [visibleEmployees, setVisibleEmployees] = useState(15);

  // Load more employees for pagination
  const loadMoreEmployees = () => {
    setVisibleEmployees((prev) => prev + 10);
  };

  // Handle individual employee deletion
  const handleDelete = (employeeId, e) => {
    e.stopPropagation(); // Prevent row click event
  };

  return (
    // Main table container
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "white",
        borderRadius: "8px",
        marginLeft: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Table structure */}
      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          {/* Table header */}
          <thead>
            <tr
              style={{
                backgroundColor: "rgba(20, 103, 236, 0.83)", // Header background
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              {/* Checkbox column for select mode */}
              {selectMode && (
                <th
                  style={{
                    padding: "0.5rem 0.25rem",
                    textAlign: "left",
                    width: "24px",
                  }}
                ></th>
              )}
              <th
                style={{
                  padding: "0.5rem 0.5rem",
                  textAlign: "left",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "rgba(236, 233, 233, 0.97)",
                  textTransform: "uppercase",
                  width: selectMode ? "30%" : "35%", // Adjust width based on select mode
                }}
              >
                Employee
              </th>
              <th
                style={{
                  padding: "0.5rem 0.5rem",
                  textAlign: "left",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "rgba(240, 237, 237, 0.87)",
                  textTransform: "uppercase",
                  width: selectMode ? "22%" : "25%",
                }}
              >
                Designation
              </th>
              <th
                style={{
                  padding: "0.5rem 0.5rem",
                  textAlign: "left",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "rgba(240, 236, 236, 0.87)",
                  textTransform: "uppercase",
                  width: selectMode ? "18%" : "20%",
                }}
              >
                Division
              </th>
              <th
                style={{
                  padding: "0.5rem 0.5rem",
                  textAlign: "left",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "rgba(240, 236, 236, 0.87)",
                  textTransform: "uppercase",
                  width: "15%",
                }}
              >
                Phone No.
              </th>
              <th
                style={{
                  padding: "0.5rem 0.5rem",
                  textAlign: "left",
                  fontSize: "1.1rem",
                  fontWeight: "500",
                  color: "rgba(250, 249, 249, 0.87)",
                  textTransform: "uppercase",
                  width: "5%",
                }}
              ></th>{" "}
              {/* Empty column for actions */}
            </tr>
          </thead>
          {/* Table body */}
          <tbody>
            {employees.slice(0, visibleEmployees).map((employee, index) => (
              <motion.tr
                key={employee.id}
                onClick={() => {
                  if (selectMode) {
                    const isSelected = selectedEmployees.includes(employee.id);
                    onEmployeeSelect(employee, !isSelected); // Toggle selection
                  } else if (onEmployeeClick) {
                    onEmployeeClick(employee); // Trigger employee click
                  }
                }}
                style={{
                  borderBottom: "1px solid #e5e7eb",
                  backgroundColor: selectedEmployees.includes(employee.id)
                    ? "rgba(59, 130, 246, 0.1)" // Highlight selected rows
                    : "transparent",
                  cursor: "pointer",
                }}
              >
                {/* Checkbox for select mode */}
                {selectMode && (
                  <td
                    style={{
                      padding: "0.75rem 0.25rem",
                      width: "20px",
                      verticalAlign: "middle",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={(e) => {
                        onEmployeeSelect(employee, e.target.checked);
                      }}
                      style={{
                        margin: "0",
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                )}
                {/* Employee name and avatar */}
                <td
                  style={{
                    padding: "0.75rem 0.5rem",
                    fontSize: "1.3rem",
                    color: "rgba(7, 7, 7, 0.76)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onEmployeeClick && onEmployeeClick(employee);
                    }}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: employee.avatarColor, // Dynamic avatar color
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "500",
                        fontSize: "1.2rem",
                      }}
                    >
                      {employee.name.charAt(0)} {/* Initial letter */}
                    </div>
                    <span style={{ fontWeight: "500", fontSize: "1.2rem" }}>
                      {employee.name}
                    </span>
                  </div>
                </td>
                {/* Designation */}
                <td
                  style={{
                    padding: "0.75rem 0.5rem",
                    fontSize: "1.2rem",
                    color: "rgba(0, 0, 0, 0.87)",
                  }}
                >
                  {employee.designation}
                </td>
                {/* Division */}
                <td
                  style={{
                    padding: "0.75rem 0.5rem",
                    fontSize: "1.2rem",
                    color: "rgba(13, 13, 14, 0.87)",
                  }}
                >
                  {employee.division}
                </td>
                {/* Phone number */}
                <td
                  style={{
                    padding: "0.75rem 0.5rem",
                    fontSize: "1.2rem",
                    color: "rgba(13, 13, 14, 0.87)",
                  }}
                >
                  {employee.phone}
                </td>
                {/* Action column */}
                <td
                  style={{
                    padding: "0.75rem 0.5rem",
                    textAlign: "right",
                    position: "relative",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {/* Delete button for admins (hidden in select mode) */}
                  {!selectMode && isAdmin && (
                    <motion.button
                      whileHover={{ scale: 1.2, color: "#ef4444" }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "rgba(18, 18, 19, 0.51)",
                        transition: "color 0.1s ease",
                        marginRight: "3rem",
                      }}
                      onClick={(e) => handleDelete(employee.id, e)}
                    >
                      <FiTrash2 size={25} />
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load more button for pagination */}
      {visibleEmployees < employees.length && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            bottom: 0,
            backgroundColor: "white",
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMoreEmployees}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#3b82f6",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Load More
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Table;

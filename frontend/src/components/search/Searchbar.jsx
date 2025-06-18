import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiChevronDown,
  FiUpload,
  FiTrash2,
  FiX,
  FiCheck,
} from "react-icons/fi"; // Icons for UI elements
import { toast, ToastContainer } from "react-toastify"; // Notification library
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import Table from "./Table"; // Table view component
import Card from "./Card"; // Card view component
import AddUser from "./Adduser"; // Add user modal component
import ImportCard from "./ImportCard"; // File import modal component
import "./Card.css"; // Styles for card view
import { motion } from "framer-motion"; // Animation library
import { Download } from "@mui/icons-material"; // Download icon
import * as XLSX from "xlsx"; // Library for Excel file generation
import { useDispatch } from "react-redux"; // Redux dispatch hook
import { moveMultipleToRecycleBin } from "../../store/employeeSlice"; // Redux action for bulk deletion
import DoneIcon from "@mui/icons-material/Done"; // Select mode icon
import ClearIcon from "@mui/icons-material/Clear"; // Clear selection icon
import { jsPDF } from "jspdf"; // Library for PDF generation
import autoTable from "jspdf-autotable"; // PDF table plugin
import logoImage from "../../assets/indianimage.png"; // Logo for PDF header
import DownloadCard from "./DownloadCard"; // Download options modal component

// Confirmation dialog for bulk deletion
const ConfirmationDialog = ({ onConfirm, onCancel, count }) => {
  return (
    // Modal overlay
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // High z-index for modal
      }}
    >
      {/* Dialog content */}
      <motion.div
        initial={{ opacity: 1, scale: 0.9 }} // Initial animation state
        animate={{ opacity: 1, scale: 1 }} // Final animation state
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Shadow for depth
        }}
      >
        <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
          Confirm Deletion
        </h3>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          Are you sure you want to delete {count} selected employees?
        </p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
          {/* Cancel button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "white",
              color: "#374151",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.15rem",
            }}
            onClick={onCancel}
          >
            <FiX /> Cancel
          </motion.button>
          {/* Confirm button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.15rem",
            }}
            onClick={onConfirm}
          >
            <FiCheck /> Confirm
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Main Searchbar component for employee search and management
const Searchbar = ({ employees, onEmployeeClick, isAdmin }) => {
  const dispatch = useDispatch(); // Redux dispatch for actions

  // State and ref hooks
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Tracks search input focus
  const [isFilterHovered, setIsFilterHovered] = useState(false); // Tracks filter button hover
  const [isAddUserHovered, setIsAddUserHovered] = useState(false); // Tracks add user button hover
  const [viewMode, setViewMode] = useState("card"); // Toggles between card and table view
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [visibleCount, setVisibleCount] = useState(15); // Number of visible employees in card view
  const [searchBy, setSearchBy] = useState("name"); // Current search field
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter dropdown visibility
  const filterRef = useRef(null); // Reference for filter dropdown
  const [showAddUser, setShowAddUser] = useState(false); // Add user modal visibility
  const [isUploadHovered, setIsUploadHovered] = useState(false); // Tracks upload button hover
  const [showImportCard, setShowImportCard] = useState(false); // Import card modal visibility
  const [selectMode, setSelectMode] = useState(false); // Selection mode for bulk actions
  const [selectedEmployees, setSelectedEmployees] = useState([]); // List of selected employee IDs
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation dialog visibility
  const [showDownloadCard, setShowDownloadCard] = useState(false); // Download card modal visibility

  // Columns for table and export
  const columns = [
    { header: "Emp No.", dataKey: "empId", minWidth: 10 },
    { header: "Title", dataKey: "title", minWidth: 10 },
    { header: "Name", dataKey: "name", minWidth: 20 },
    { header: "Email", dataKey: "email", minWidth: 25 },
    { header: "Designation", dataKey: "designation", minWidth: 20 },
    { header: "Division", dataKey: "division", minWidth: 15 },
    { header: "Function", dataKey: "function", minWidth: 15 },
    { header: "Worker Type", dataKey: "workerType", minWidth: 15 },
    { header: "Phone", dataKey: "phone", minWidth: 15 },
    { header: "Gender", dataKey: "gender", minWidth: 10 },
    { header: "DOB", dataKey: "dob", minWidth: 15 },
    { header: "Address", dataKey: "address", minWidth: 30 },
    { header: "City", dataKey: "city", minWidth: 15 },
    { header: "Location", dataKey: "location", minWidth: 15 },
    { header: "Subgroup", dataKey: "subgroup", minWidth: 15 },
    { header: "Subgroup Code", dataKey: "subgroupCode", minWidth: 15 },
    { header: "Blood Group", dataKey: "bloodGroup", minWidth: 15 },
    { header: "Work Schedule", dataKey: "workSchedule", minWidth: 15 },
    { header: "Working Hours", dataKey: "workingHours", minWidth: 15 },
  ];

  // Handle new user addition
  const handleAddUser = (newEmployee) => {
    setShowAddUser(false); // Close add user modal
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter employees based on search term and criteria
  const filteredEmployees = employees.filter((employee) => {
    const searchTermLower = searchTerm.toLowerCase();
    switch (searchBy) {
      case "name":
        return employee.name?.toLowerCase().includes(searchTermLower);
      case "empId":
        return employee.empId?.toLowerCase().includes(searchTermLower);
      case "email":
        return employee.email?.toLowerCase().includes(searchTermLower);
      case "phone":
        return employee.phone?.toLowerCase().includes(searchTermLower);
      default:
        return employee.name?.toLowerCase().includes(searchTermLower);
    }
  });

  // Load more employees in card view
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 15);
  };

  // Toggle selection mode
  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedEmployees([]); // Clear selection when exiting mode
    }
  };

  // Handle employee selection for bulk actions
  const handleEmployeeSelection = (employee, isSelected) => {
    if (isSelected) {
      setSelectedEmployees((prev) => [...prev, employee.id]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employee.id));
    }
  };

  // Handle export to Excel or PDF
  const handleDownload = (type, selectedColumns = null) => {
    // Determine employees to export
    const employeesToExport = selectMode
      ? filteredEmployees.filter((emp) => selectedEmployees.includes(emp.id))
      : filteredEmployees;

    if (employeesToExport.length === 0) {
      toast.warning("No employees to download");
      return;
    }

    // Get columns to include in export
    const columnsToInclude = selectedColumns
      ? Object.keys(selectedColumns).filter((key) => selectedColumns[key])
      : columns.map((col) => col.dataKey);

    if (type === "excel") {
      // Prepare Excel data
      const data = employeesToExport.map((employee) => {
        const row = {};
        columns.forEach((col) => {
          if (columnsToInclude.includes(col.dataKey)) {
            row[col.header] = employee[col.dataKey] || "";
          }
        });
        return row;
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
      XLSX.writeFile(workbook, "employees.xlsx");
    } else if (type === "pdf") {
      // Create PDF document
      const doc = new jsPDF({
        orientation: "landscape",
      });

      // Add logo to top right
      const imgData = logoImage;
      const imgWidth = 16;
      const imgHeight = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 6;

      doc.addImage(
        imgData,
        "PNG",
        pageWidth - imgWidth - margin,
        margin,
        imgWidth,
        imgHeight
      );

      // Add title
      doc.setFontSize(16);
      doc.text("Employee Directory", pageWidth / 2, imgHeight + margin + 0, {
        align: "center",
      });

      // Prepare table data
      const tableData = employeesToExport.map((employee) => {
        return columns
          .filter((col) => columnsToInclude.includes(col.dataKey))
          .map((col) => employee[col.dataKey] || "N/A");
      });

      // Filter columns for table
      const filteredColumns = columns.filter((col) =>
        columnsToInclude.includes(col.dataKey)
      );

      // Generate PDF table
      autoTable(doc, {
        head: [filteredColumns.map((col) => col.header)],
        body: tableData,
        startY: imgHeight + margin + 8,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 6,
          cellPadding: 1,
          minCellHeight: 5,
        },
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontSize: 7,
          fontStyle: "bold",
        },
        columnStyles: filteredColumns.reduce((acc, col) => {
          acc[col.header] = {
            cellWidth: col.minWidth,
            minCellWidth: col.minWidth,
          };
          return acc;
        }, {}),
        didDrawPage: function (data) {
          // Add page number footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 5
          );
        },
      });

      doc.save("employees.pdf");
    }

    // Show success notification
    toast.success(
      `Downloaded ${
        employeesToExport.length
      } employees as ${type.toLowerCase()}`
    );

    setShowDownloadCard(false); // Close download card
  };

  return (
    // Main container for search bar and employee display
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        marginBottom: "2rem",
        marginLeft: "auto",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top bar with controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* View mode toggle */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#3b82f6",
              borderRadius: "25px",
              padding: "2px",
            }}
          >
            <button
              onClick={() => setViewMode("card")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "25px",
                border: "none",
                backgroundColor:
                  viewMode === "card" ? "#ffffff" : "transparent",
                color:
                  viewMode === "card"
                    ? "rgba(59, 130, 246, 1)"
                    : "rgb(255, 255, 255)",
                fontWeight: viewMode === "card" ? "600" : "500",
                cursor: "pointer",
                boxShadow:
                  viewMode === "card" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Card
            </button>
            <button
              onClick={() => setViewMode("table")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "25px",
                border: "none",
                backgroundColor:
                  viewMode === "table" ? "#ffffff" : "transparent",
                color:
                  viewMode === "table"
                    ? "rgba(59, 130, 246, 1)"
                    : "rgb(255, 255, 255)",
                fontWeight: viewMode === "table" ? "600" : "500",
                cursor: "pointer",
                boxShadow:
                  viewMode === "table" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s ease",
              }}
            >
              Table
            </button>
          </div>

          {/* Download button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              border: "none",
              backgroundColor: selectMode ? "#10b981" : "#3b82f6",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => setShowDownloadCard(true)}
          >
            <Download fontSize="small" />
            {selectMode ? `Download (${selectedEmployees.length})` : "Download"}
          </motion.button>
          {showDownloadCard && (
            <DownloadCard
              columns={columns}
              onDownload={handleDownload}
              onClose={() => setShowDownloadCard(false)}
              selectedEmployeesCount={selectedEmployees.length}
              selectMode={selectMode}
            />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Search input */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FiSearch
              style={{
                position: "absolute",
                left: "12px",
                color: "rgba(0, 0, 0, 0.49)",
                transition: "all 0.3s ease",
              }}
            />
            <input
              type="text"
              placeholder={
                searchBy === "empId"
                  ? "Search by Emp No."
                  : `Search by ${searchBy}...`
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "0.5rem 1rem 0.5rem 2.5rem",
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.27)",
                fontSize: "1.2rem",
                color: "#374151",
                width: isSearchFocused ? "500px" : "350px",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Filter dropdown */}
          <div style={{ position: "relative" }} ref={filterRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "1px solid rgba(0, 0, 0, 0.27)",
                backgroundColor: "white",
                color: "#4b5563",
                fontSize: "1.2rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                transform: isFilterHovered ? "scale(1.05)" : "scale(1)",
                boxShadow: isFilterHovered
                  ? "0 2px 5px rgba(0,0,0,0.1)"
                  : "none",
              }}
              onMouseEnter={() => setIsFilterHovered(true)}
              onMouseLeave={() => setIsFilterHovered(false)}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter />
              <span>{searchBy === "empId" ? "emp no" : `${searchBy}`}</span>
              <FiChevronDown />
            </motion.button>

            {isFilterOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  backgroundColor: "white",
                  borderRadius: "6px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  zIndex: 10,
                  width: "200px",
                  marginTop: "0.5rem",
                }}
              >
                {["name", "empId", "email", "phone"].map((option) => (
                  <motion.div
                    key={option}
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                    style={{
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      backgroundColor:
                        searchBy === option ? "#f3f4f6" : "transparent",
                      borderRadius: "4px",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      setSearchBy(option);
                      setIsFilterOpen(false);
                    }}
                  >
                    {option === "name"
                      ? "Name"
                      : option === "empId"
                      ? "Employee No."
                      : option === "email"
                      ? "Email"
                      : "Phone No."}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Select/Clear button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: selectMode ? "#ef4444" : "#3b82f6",
              color: "white",
              fontSize: "1.2rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={toggleSelectMode}
          >
            {selectMode ? <ClearIcon /> : <DoneIcon />}
            {selectMode ? "Clear" : "Select"}
          </motion.button>

          {/* Admin-only controls */}
          {isAdmin && (
            <>
              {selectMode && (
                <>
                  {/* Delete button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#ef4444",
                      color: "white",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      if (selectedEmployees.length > 0) {
                        setShowConfirmation(true);
                      } else {
                        toast.error("No employees selected for deletion");
                      }
                    }}
                  >
                    <FiTrash2 />
                    Delete ({selectedEmployees.length})
                  </motion.button>

                  {showConfirmation && (
                    <ConfirmationDialog
                      count={selectedEmployees.length}
                      onConfirm={() => {
                        dispatch(moveMultipleToRecycleBin(selectedEmployees))
                          .unwrap()
                          .then(() => {
                            toast.success(
                              `Moved ${selectedEmployees.length} employees to recycle bin`
                            );
                            setSelectedEmployees([]);
                            setSelectMode(false);
                          })
                          .catch((error) => {
                            toast.error(
                              `Failed to move to recycle bin: ${
                                error.message || "Server error"
                              }`
                            );
                          })
                          .finally(() => {
                            setShowConfirmation(false);
                          });
                      }}
                      onCancel={() => setShowConfirmation(false)}
                    />
                  )}
                </>
              )}

              {/* Add user button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isAddUserHovered ? "scale(1.05)" : "scale(1)",
                  boxShadow: isAddUserHovered
                    ? "0 2px 5px rgba(0,0,0,0.2)"
                    : "none",
                }}
                onMouseEnter={() => setIsAddUserHovered(true)}
                onMouseLeave={() => setIsAddUserHovered(false)}
                onClick={() => setShowAddUser(true)}
              >
                <FiPlus />
                Add User
              </motion.button>

              {/* Upload file button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  transform: isUploadHovered ? "scale(1.05)" : "scale(1)",
                  boxShadow: isUploadHovered
                    ? "0 2px 5px rgba(0,0,0,0.2)"
                    : "none",
                }}
                onMouseEnter={() => setIsUploadHovered(true)}
                onMouseLeave={() => setIsUploadHovered(false)}
                onClick={() => setShowImportCard(true)}
              >
                <FiUpload />
                Upload File
              </motion.button>
            </>
          )}

          {/* Modals */}
          {showAddUser && (
            <AddUser
              onClose={() => setShowAddUser(false)}
              onSubmit={handleAddUser}
            />
          )}
          {showImportCard && (
            <ImportCard onClose={() => setShowImportCard(false)} />
          )}
        </div>
      </div>

      {/* Employee display */}
      <div style={{ marginTop: "1.5rem" }}>
        {viewMode === "table" ? (
          <Table
            employees={filteredEmployees}
            onEmployeeClick={selectMode ? null : onEmployeeClick}
            selectMode={selectMode}
            onEmployeeSelect={handleEmployeeSelection}
            selectedEmployees={selectedEmployees}
            isAdmin={isAdmin}
          />
        ) : (
          <>
            <div className="cards-grid">
              {filteredEmployees.length > 0 ? (
                filteredEmployees
                  .slice(0, visibleCount)
                  .map((employee) => (
                    <Card
                      key={employee.id}
                      employee={employee}
                      onEmployeeClick={selectMode ? null : onEmployeeClick}
                      selectMode={selectMode}
                      onEmployeeSelect={handleEmployeeSelection}
                      isSelected={selectedEmployees.includes(employee.id)}
                      isAdmin={isAdmin}
                    />
                  ))
              ) : (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    textAlign: "center",
                    padding: "2rem",
                    color: "#6b7280",
                  }}
                >
                  No employees found matching your search criteria
                </div>
              )}
            </div>

            {/* Load more button */}
            {filteredEmployees.length > visibleCount && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={loadMore}
                  style={{
                    padding: "0.75rem 1.5rem",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    transform: "scale(1)",
                    marginTop: "1rem",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

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

export default Searchbar;

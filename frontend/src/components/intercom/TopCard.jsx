import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { FiChevronDown, FiCheck, FiTrash2, FiX, FiPlus } from "react-icons/fi";
import UploadIcon from "@mui/icons-material/Upload";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import DownloadCardMUI from "./DownloadCardMUI";
import logoImage from "../../assets/indianimage.png";

const ConfirmationDialog = ({ onConfirm, onCancel, count }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <motion.div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1rem", fontSize: "1.4rem" }}>
          Confirm Deletion
        </h3>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          Are you sure you want to delete {count} selected employees
        </p>
        <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
          These employees cannot be recovered after deletion.
        </p>
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
        >
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
            }}
            onClick={onCancel}
          >
            <FiX /> Cancel
          </motion.button>
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
            }}
            onClick={onConfirm}
          >
            <FiCheck /> Confirm
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main toolbar component with search, filters, and actions
const TopCard = ({
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onAddUserClick,
  onUploadClick,
  onToggleSelectMode,
  onDeleteSelected,
  selectMode,
  selectedCount,
  employeeData,
  selectedEmployees,
  filterOptions,
  isAdmin,
}) => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showWarning, setShowWarning] = useState(true);
  const [searchBy, setSearchBy] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [showDownloadCard, setShowDownloadCard] = useState(false);

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

  const [filters, setFilters] = useState({
    status: "",
    grade: "",
    floor: "",
    location: "",
    workerType: "",
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "",
      grade: "",
      floor: "",
      location: "",
      workerType: "",
    });
    onClearFilters();
  };

  // Handle search changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value, searchBy);
    }
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const columns = [
    { header: "Emp No.", dataKey: "empNo", minWidth: 10 },
    { header: "Name", dataKey: "name", minWidth: 20 },
    { header: "Intercom No.", dataKey: "intercom", minWidth: 15 },
    { header: "Grade", dataKey: "grade", minWidth: 10 },
    { header: "Floor", dataKey: "floor", minWidth: 10 },
    { header: "Location", dataKey: "location", minWidth: 15 },
    { header: "Designation", dataKey: "designation", minWidth: 20 },
    { header: "Division", dataKey: "division", minWidth: 15 },
    { header: "Phone No.", dataKey: "phone", minWidth: 15 },
    { header: "Email", dataKey: "email", minWidth: 25 },
  ];

  const handleDownload = (type, selectedColumns = null) => {
    // Determine which employees to export
    const employeesToExport = selectMode
      ? employeeData.filter((emp) => selectedEmployees.includes(emp.id))
      : employeeData;

    if (employeesToExport.length === 0) {
      toast.warning("No employees to download");
      return;
    }

    // Get the columns to include
    const columnsToInclude = selectedColumns
      ? Object.keys(selectedColumns).filter((key) => selectedColumns[key])
      : columns.map((col) => col.dataKey);

    if (type === "excel") {
      // Prepare the data for Excel with only selected columns
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
      // Create PDF document in landscape orientation
      const doc = new jsPDF({
        orientation: "landscape",
      });

      // Add image to top right corner
      const imgData = logoImage;
      const imgWidth = 16;
      const imgHeight = 14;
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 6;

      // Add image to top right
      doc.addImage(
        imgData,
        "PNG",
        pageWidth - imgWidth - margin,
        margin,
        imgWidth,
        imgHeight
      );

      // Add title below the image
      doc.setFontSize(16);
      doc.text("Employee Directory", pageWidth / 2, imgHeight + margin + 0, {
        align: "center",
      });

      // Prepare table data with only selected columns
      const tableData = employeesToExport.map((employee) => {
        return columns
          .filter((col) => columnsToInclude.includes(col.dataKey))
          .map((col) => employee[col.dataKey] || "N/A");
      });

      // Filter columns based on selection
      const filteredColumns = columns.filter((col) =>
        columnsToInclude.includes(col.dataKey)
      );

      // Create table
      autoTable(doc, {
        head: [filteredColumns.map((col) => col.header)],
        body: tableData,
        startY: imgHeight + margin + 8,
        margin: { left: 5, right: 5 },
        styles: {
          fontSize: 6,
          cellPadding: 1,
          overflow: "linebreak",
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
          // Footer
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(
            `Page ${data.pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.height - 5
          );
        },
      });

      // Save the PDF
      doc.save("employees.pdf");
    }

    // Show success toast
    toast.success(
      `Downloaded ${
        employeesToExport.length
      } employee(s) as ${type.toUpperCase()}`
    );

    // Close the download card
    setShowDownloadCard(false);
  };

  return (
    <Card
      sx={{
        width: "calc(100% - 20px)",
        height: "25vh",
        margin: "10px",
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0)",
        background: "linear-gradient(145deg,rgb(222, 243, 248), #f5f7ff)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        overflow: "visible",
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "16px",
          padding: "2px",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "24px !important",
        }}
      >
        {/* Search Bar Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            width: "100%",
            marginTop: 5,
          }}
        >
          {/* upload button */}
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={onUploadClick}
              sx={{
                borderRadius: "50px",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
                "&:hover": {
                  boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Upload Files
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={onAddUserClick}
              sx={{
                borderRadius: "50px",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
                "&:hover": {
                  boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Add User
            </Button>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "35vw",
              position: "relative",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search by ${
                searchBy === "name"
                  ? "name"
                  : searchBy === "empNo"
                  ? "employee number"
                  : "intercom"
              }...`}
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "primary.main" }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "50px",
                  backgroundColor: "rgb(245, 245, 245)",
                  boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.16)",
                  "& fieldset": { border: "none" },
                  height: "55px",
                  fontSize: "1.2rem",
                },
              }}
            />
            {searchTerm && (
              <IconButton
                onClick={() => {
                  setSearchTerm("");
                  onSearchChange("");
                }}
                sx={{
                  position: "absolute",
                  right: 60,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "text.secondary",
                  "&:hover": {
                    color: "primary.main",
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}

            {/* Search by dropdown - positioned on the right */}
            <Box sx={{ position: "relative", ml: 1 }} ref={filterRef}>
              <Button
                variant="contained"
                endIcon={<FiChevronDown />}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                sx={{
                  borderRadius: "50px",
                  padding: "12px 20px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
                  backgroundColor: "white",
                  color: "rgba(0, 0, 0, 0.75)",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                    boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.19)",
                  },
                  whiteSpace: "nowrap",
                  minWidth: "120px",
                }}
              >
                {searchBy === "name"
                  ? "Name"
                  : searchBy === "empNo"
                  ? "Emp No"
                  : "Intercom"}
              </Button>

              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 1, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 1, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    zIndex: 1000,
                    width: "150px",
                    marginTop: "5px",
                    overflow: "hidden",
                  }}
                >
                  {["name", "empNo", "intercom"].map((option) => (
                    <motion.div
                      key={option}
                      whileHover={{ backgroundColor: "#f3f4f6" }}
                      style={{
                        padding: "12px 16px",
                        cursor: "pointer",
                        backgroundColor:
                          searchBy === option ? "#f3f4f6" : "transparent",
                        transition: "background-color 0.2s ease",
                      }}
                      onClick={() => {
                        setSearchBy(option);
                        setIsFilterOpen(false);

                        if (searchTerm) {
                          onSearchChange(searchTerm, option);
                        }
                      }}
                    >
                      {option === "name"
                        ? "Name"
                        : option === "empNo"
                        ? "Emp No"
                        : "Intercom"}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={selectMode ? <ClearIcon /> : <DoneIcon />}
            onClick={onToggleSelectMode}
            sx={{
              borderRadius: "50px",
              padding: "10px 20px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
              backgroundColor: selectMode ? "#ef4444" : "rgb(49, 112, 212)",
              "&:hover": {
                boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            {selectMode ? `Clear (${selectedCount})` : "Select"}
          </Button>

          {selectMode && isAdmin && (
            <Button
              variant="contained"
              startIcon={<FiTrash2 />}
              onClick={() => {
                if (selectedCount > 0) {
                  onDeleteSelected();
                } else {
                  toast.warning("No employees selected for deletion");
                }
              }}
              sx={{
                borderRadius: "50px",
                padding: "10px 20px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
                backgroundColor: "#ef4444",
                "&:hover": {
                  boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              Delete ({selectedCount})
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setShowDownloadCard(true)}
            sx={{
              borderRadius: "50px",
              padding: "10px 20px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
              backgroundColor: selectMode ? "#10b981" : "rgb(49, 112, 212)",
              "&:hover": {
                boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            {selectMode ? `Download (${selectedCount})` : "Download"}
          </Button>
        </Box>

        {/* Filter Dropdowns Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "auto",
            paddingBottom: 1,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<FilterAltIcon />}
            onClick={handleClearFilters}
            sx={{
              borderRadius: "50px",
              padding: "10px 20px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1.1rem",
              boxShadow: "4px 6px 15px rgba(0, 0, 0, 0.19)",
              backgroundColor: "rgb(49, 112, 212)",
              "&:hover": {
                boxShadow: "4px 6px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Clear Filters
          </Button>

          {Object.entries({
            status: filterOptions.status,
            grade: filterOptions.grades,
            floor: filterOptions.floors,
            location: filterOptions.locations,
            ...(isAdmin && { workerType: filterOptions.workerTypes }),
          }).map(([key, options]) => (
            <Box key={key} sx={{ flex: 1, minWidth: 0, position: "relative" }}>
              <TextField
                select
                label={
                  filters[key]
                    ? ""
                    : key === "status"
                    ? "Status"
                    : key === "workerType"
                    ? "Worker Type"
                    : key.charAt(0).toUpperCase() + key.slice(1)
                }
                variant="filled"
                size="small"
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                sx={{
                  width: "100%",
                  "& .MuiFilledInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    },
                    "&:before, &:after": { display: "none" },
                  },
                  "& .MuiFilledInput-input": {
                    paddingTop: filters[key] ? "14px" : "22px",
                    paddingBottom: "8px",
                    paddingLeft: "16px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "0.9rem",
                    transform: filters[key]
                      ? "translate(12px, 10px) scale(1)"
                      : "translate(12px, 14px) scale(1)",
                    "&.Mui-focused": {
                      color: "rgba(0, 0, 0, 0.6)",
                    },
                  },
                  "& .MuiSelect-icon": {
                    color: "rgba(0, 0, 0, 0.54)",
                    right: "8px",
                  },
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        borderRadius: "12px",
                        marginTop: 1,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                        maxHeight: 300,
                        "& .MuiMenuItem-root": {
                          padding: "8px 16px",
                          fontSize: "0.9rem",
                          "&:hover": {
                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                          },
                        },
                        "& .Mui-selected": {
                          backgroundColor: "rgba(59, 130, 246, 0.2) !important",
                        },
                      },
                    },
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  },
                  renderValue: (value) => {
                    if (!value) return null;
                    return value;
                  },
                }}
              >
                <MenuItem value="">
                  <em>{key === "status" ? "All Status" : `All ${key}s`}</em>
                </MenuItem>
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{
                      position: "relative",
                      "&:not(:last-child)::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: "16px",
                        right: "16px",
                        height: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.08)",
                      },
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Box>
      </CardContent>

      {/* download card overlay */}
      {showDownloadCard && (
        <DownloadCardMUI
          columns={columns}
          onDownload={handleDownload}
          onClose={() => setShowDownloadCard(false)}
          selectedEmployeesCount={selectedCount}
          selectMode={selectMode}
        />
      )}
    </Card>
  );
};

export default TopCard;

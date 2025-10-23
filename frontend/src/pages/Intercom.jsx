import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { Box, Card, CardContent } from "@mui/material"; // Material-UI components
import TopCard from "../components/intercom/TopCard"; // Top filter/search bar
import IntercomCard from "../components/intercom/IntercomCard"; // Employee card list
import LeftCard from "../components/intercom/LeftCard"; // Employee details panel
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import IntercomUpload from "../components/intercom/IntercomUpload"; // File upload component
import { toast, ToastContainer } from "react-toastify"; // Notification library
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { FiCheck, FiX } from "react-icons/fi"; // Check and close icons
import { fetchIntercomData, deleteIntercomBulk } from "../store/employeeSlice"; // Redux actions
import Loader from "../components/shared/Loader"; // Loading indicator

// Confirmation dialog for bulk deletion
const ConfirmationDialog = ({ onConfirm, onCancel, count }) => {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.29)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <motion.div
        initial={{ opacity: 1, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1.5rem",
          maxWidth: "23vw",
          width: "100%",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
          Confirm Deletion
        </h3>
        <p style={{ marginBottom: "0.7rem", fontSize: "1.25rem" }}>
          Are you sure you want to delete {count} selected employees
        </p>
        <p
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "rgb(221, 42, 42)",
          }}
        >
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
              fontSize: "1.3rem",
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
              fontSize: "1.3rem",
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

// Intercom component for managing employee intercom data
const Intercom = () => {
  const dispatch = useDispatch();
  const { intercomData, loading, error } = useSelector(
    (state) => state.employee
  );

  const [employeeData, setEmployeeData] = useState(intercomData);

  useEffect(() => {
    if (intercomData.length === 0) {
      dispatch(fetchIntercomData());
    }
    toast.warning(
      "Changes made in here will not be reflected on the Search Page",
      {
        autoClose: 10000,
      }
    );
  }, [dispatch]);

  // Update employee data and dropdown options when intercom data changes
  useEffect(() => {
    if (intercomData.length > 0) {
      setEmployeeData(intercomData);

      setDropdownOptions({
        grades: getUniqueGrades(intercomData),
        floors: getUniqueFloors(intercomData),
        status: getUniqueStatuses(intercomData),
        designations: getUniqueDesignations(intercomData),
        locations: getUniqueLocations(intercomData),
        workerTypes: isAdmin ? getUniqueWorkerTypes(intercomData) : [],
      });
    }
  }, [intercomData]);

  // State for UI interactions
  const [isLeftCardOpen, setIsLeftCardOpen] = useState(false); // Left panel visibility
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [filters, setFilters] = useState({
    status: "",
    grade: "",
    floor: "",
    location: "",
    workerType: "",
  }); // Filter options
  const [visibleCards, setVisibleCards] = useState(8); // Number of visible employee cards
  const [showUpload, setShowUpload] = useState(false); // Upload modal visibility
  const [selectMode, setSelectMode] = useState(false); // Bulk select mode
  const [selectedEmployees, setSelectedEmployees] = useState([]); // Selected employee IDs
  const [showConfirmation, setShowConfirmation] = useState(false); // Confirmation dialog visibility
  const [searchBy, setSearchBy] = useState("name"); // Search field type
  const [showAddUser, setShowAddUser] = useState(false); // Add user modal visibility

  const currentUser = JSON.parse(localStorage.getItem("authState"));
  const isAdmin = currentUser.isAdmin;

  // Toggle bulk select mode
  const handleToggleSelectMode = () => {
    setSelectMode(!selectMode);
    if (selectMode) {
      setSelectedEmployees([]);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter((id) => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  // Handle bulk deletion of selected employees
  const handleDeleteSelected = async () => {
    try {
      await dispatch(deleteIntercomBulk(selectedEmployees)).unwrap();

      toast.success(
        `Deleted ${selectedEmployees.length} employees successfully`
      );

      setSelectedEmployees([]);
      setSelectMode(false);
      setShowConfirmation(false);
    } catch (error) {
      console.error("Error deleting employees:", error);
      toast.error(`Failed to delete employees: ${error.message}`);
    }
  };

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employeeData.filter((employee) => {
      const matchesSearch =
        searchTerm === "" ||
        (searchBy === "name" &&
          employee.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchBy === "empNo" &&
          employee.empNo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (searchBy === "intercom" &&
          employee.intercom?.toString().startsWith(searchTerm));

      const matchesFilters =
        (filters.status === "" || employee.status === filters.status) &&
        (filters.grade === "" || employee.grade === filters.grade) &&
        (filters.floor === "" ||
          employee.floor?.toString() === filters.floor) &&
        (filters.location === "" || employee.location === filters.location) &&
        (filters.workerType === "" ||
          employee.workerType === filters.workerType);
      return matchesSearch && matchesFilters;
    });
  }, [employeeData, searchTerm, searchBy, filters]);

  // Handle card click to show employee details
  const handleCardClick = (employee) => {
    setSelectedEmployee(employee);
    setIsLeftCardOpen(true);
  };
  // Handle search term and type changes
  const handleSearchChange = (term, searchBy = "name") => {
    setSearchTerm(term);
    setSearchBy(searchBy);
  };
  // Handle filter updates
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };
  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      status: "",
      grade: "",
      floor: "",
      location: "",
      workerType: "",
    });
  };

  // Memoized list of displayed employees
  const displayedEmployees = useMemo(() => {
    return filteredEmployees.slice(0, visibleCards);
  }, [filteredEmployees, visibleCards]);

  // Load more employee cards
  const loadMoreCards = () => {
    setVisibleCards((prev) => prev + 8);
  };

  // Handle employee save action
  const handleSaveEmployee = (updatedEmployee) => {
    toast.success("Profile Successfully Updated");
  };

  // Get unique statuses from employee data
  const getUniqueStatuses = (data = employeeData) => {
    const statuses = new Set();
    data.forEach((employee) => {
      if (employee.status) statuses.add(employee.status);
    });
    return Array.from(statuses).sort();
  };

  // Get unique grades from employee data
  const getUniqueGrades = (data = employeeData) => {
    const grades = new Set();
    data.forEach((employee) => {
      if (employee.grade) grades.add(employee.grade);
    });
    return Array.from(grades).sort();
  };

  // Get unique floors from employee data
  const getUniqueFloors = (data = employeeData) => {
    const floors = new Set();
    data.forEach((employee) => {
      if (employee.floor) floors.add(employee.floor.toString());
    });
    return Array.from(floors).sort((a, b) => a - b);
  };
  // Get unique designations from employee data
  const getUniqueDesignations = (data = employeeData) => {
    const designations = new Set();
    data.forEach((employee) => {
      if (employee.designation) designations.add(employee.designation);
    });
    return Array.from(designations).sort();
  };

  // Get unique locations from employee data
  const getUniqueLocations = (data = employeeData) => {
    const locations = new Set();
    data.forEach((employee) => {
      if (employee.location) locations.add(employee.location);
    });
    return Array.from(locations).sort();
  };

  // Get unique worker types from employee data
  const getUniqueWorkerTypes = (data = employeeData) => {
    const workerTypes = new Set();
    data.forEach((employee) => {
      if (employee.workerType) workerTypes.add(employee.workerType);
    });
    return Array.from(workerTypes).sort();
  };

  // State for dropdowns
  const [dropdownOptions, setDropdownOptions] = useState({
    grades: getUniqueGrades(),
    floors: getUniqueFloors(),
    status: getUniqueStatuses(),
    designations: getUniqueDesignations(),
    locations: getUniqueLocations(),
    workerTypes: isAdmin ? getUniqueWorkerTypes() : [],
  });

  if (loading) {
    return <Loader message="Connecting to Database..." />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
        paddingLeft: "100px",
        boxSizing: "border-box",
        background: "linear-gradient(145deg,rgb(224, 241, 248), #f5f7ff)",
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Top Card for search and filters */}
      <TopCard
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onAddUserClick={() => {
          setShowAddUser(true);
          setIsLeftCardOpen(false);
        }}
        onUploadClick={() => setShowUpload(true)}
        onToggleSelectMode={handleToggleSelectMode}
        onDeleteSelected={() => {
          if (selectedEmployees.length > 0) {
            setShowConfirmation(true);
          } else {
            toast.warning("No employees selected for deletion");
          }
        }}
        selectMode={selectMode}
        selectedCount={selectedEmployees.length}
        employeeData={filteredEmployees}
        selectedEmployees={selectedEmployees}
        filterOptions={dropdownOptions}
        isAdmin={isAdmin}
      />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          gap: "10px",
          padding: "10px",
          overflow: "hidden",
          position: "relative",
          alignItems: "stretch",
        }}
      >
        {/* Left Card with Framer Motion */}
        <AnimatePresence>
          {isLeftCardOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                width: "30vw",
              }}
              exit={{
                x: -300,
                opacity: 0,
                width: 0,
                transition: { duration: 0.3 },
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 120,
              }}
              style={{
                height: "100%",
                position: "relative",
                overflow: "hidden",
                zIndex: 2,
              }}
            >
              <Card
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  backgroundColor: "rgba(231, 244, 250, 0.8)",
                }}
              >
                <LeftCard
                  employee={selectedEmployee}
                  onClose={() => setIsLeftCardOpen(false)}
                  onSave={handleSaveEmployee}
                />
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Card */}
        <motion.div
          initial={{ x: 0 }}
          animate={{
            x: isLeftCardOpen ? 0 : 0,
            width: isLeftCardOpen ? "calc(100% )" : "100%",
          }}
          transition={{
            type: isLeftCardOpen ? "spring" : "",
            damping: isLeftCardOpen ? 25 : 0,
            stiffness: isLeftCardOpen ? 120 : 0,
            duration: isLeftCardOpen ? 0.3 : 0,
          }}
          style={{
            height: "100%",
            overflow: "hidden",
            zIndex: 1,
          }}
        >
          <Card
            sx={{
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(120deg,rgb(232, 249, 255) 50%, rgb(255, 255, 255) 90%)",
            }}
          >
            <CardContent
              sx={{
                height: "calc(100% - 32px)",
                padding: "16px !important",
                overflow: "auto",
              }}
            >
              <IntercomCard
                employeeData={displayedEmployees}
                isLeftCardOpen={isLeftCardOpen}
                onCardClick={handleCardClick}
                hasMore={filteredEmployees.length > visibleCards}
                onLoadMore={loadMoreCards}
                showAddUser={showAddUser}
                setShowAddUser={setShowAddUser}
                selectMode={selectMode}
                selectedEmployees={selectedEmployees}
                onEmployeeSelect={handleEmployeeSelect}
                gradeOptions={dropdownOptions.grades}
                floorOptions={dropdownOptions.floors}
              />
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Upload Modal */}
      {showUpload && <IntercomUpload onClose={() => setShowUpload(false)} />}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          count={selectedEmployees.length}
          onConfirm={handleDeleteSelected}
          onCancel={() => setShowConfirmation(false)}
        />
      )}

      {/* Toast Notifications */}
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
    </Box>
  );
};

export default Intercom;

import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import LineChart from "../components/search/Linechart";
import PieChart from "../components/search/Piechart";
import Searchbar from "../components/search/Searchbar";
import Filter from "../components/search/Filter";
import EmpPage from "../components/shared/EmpPage";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLineChartData,
  fetchPieChartData,
  fetchAllEmployees,
} from "../store/employeeSlice";
import Loader from "../components/shared/Loader";
import IndianOilLogo from "../assets/indianimage1.png";

const Search = () => {
  // Get current user from localStorage (commented out admin check)
  const currentUser = JSON.parse(localStorage.getItem('authState')); 
  const isAdmin = currentUser.isAdmin; 

  // Redux state management setup
  const dispatch = useDispatch();
  const { allEmployees, lineChartData, pieChartData, loading, error } =
    useSelector((state) => state.employee);

  // Preload company logo image
  useEffect(() => {
    const img = new Image();
    img.src = IndianOilLogo;
  }, []);

  // Fetch data sequentially on component mount
  useEffect(() => {
    const fetchDataSequentially = async () => {
      try {
        window.scrollTo(0, 0);
        // Fetch line chart data if not already loaded
        if (!lineChartData || lineChartData.length === 0) {
          await dispatch(fetchLineChartData()).unwrap();
        }
        // Fetch pie chart data if not already loaded
        if (!pieChartData || pieChartData.length === 0) {
          await dispatch(fetchPieChartData()).unwrap();
        }
        // Fetch all employees if not already loaded
        if (allEmployees.length === 0) {
          await dispatch(fetchAllEmployees()).unwrap();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataSequentially();
  }, [dispatch]);

  // Employee data state
  const employeeData = allEmployees.length > 0 ? allEmployees : [];

  // Selected employee and overlay state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeOverlay, setShowEmployeeOverlay] = useState(false);

  // Filtered employees state
  const [filteredEmployees, setFilteredEmployees] = useState(employeeData);

  useEffect(() => {
    if (allEmployees.length > 0) {
      setFilteredEmployees(allEmployees);
    }
  }, [allEmployees]);

  // Filter criteria state
  const [filters, setFilters] = useState({
    divisions: [],
    designations: [],
    functions: [],
    genders: [],
    ageRange: [0, 100],
    locations: [],
    grades: [],
    bloodGroups: [],
  });

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());
    if (!hasBirthdayPassed) {
      age--;
    }
    return age;
  };

  // Apply all active filters to employee data
  const applyFilters = (newFilters) => {
    setFilters(newFilters);

    const filtered = employeeData.filter((employee) => {
      const age = calculateAge(employee.dob);

      if (age < newFilters.ageRange[0] || age > newFilters.ageRange[1]) {
        return false;
      }
      if (
        newFilters.genders?.length > 0 &&
        !newFilters.genders.includes(employee.gender)
      ) {
        return false;
      }
      if (
        newFilters.divisions?.length > 0 &&
        !newFilters.divisions.includes(employee.division)
      ) {
        return false;
      }
      if (
        newFilters.locations?.length > 0 &&
        !newFilters.locations.includes(employee.location)
      ) {
        return false;
      }
      if (newFilters.grades?.length > 0) {
        const employeeGrade = employee.subgroupCode?.slice(-1);
        if (!employeeGrade || !newFilters.grades.includes(employeeGrade)) {
          return false;
        }
      }
      if (
        newFilters.designations?.length > 0 &&
        !newFilters.designations.includes(employee.designation)
      ) {
        return false;
      }
      if (
        newFilters.functions?.length > 0 &&
        !newFilters.functions.includes(employee.function)
      ) {
        return false;
      }
      if (
        newFilters.bloodGroups.length > 0 &&
        !newFilters.bloodGroups.includes(employee.bloodGroup)
      ) {
        return false;
      }

      return true;
    });

    setFilteredEmployees(filtered);
  };

  // Handle employee selection for overlay display
  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeOverlay(true);
    document.body.style.overflow = "hidden";
  };

  // Close employee overlay
  const closeOverlay = () => {
    setShowEmployeeOverlay(false);
    setSelectedEmployee(null);
    document.body.style.overflow = "auto";
  };

  // Show loader while data is loading
  if (loading || !lineChartData || !pieChartData || allEmployees.length === 0) {
    return <Loader message="Connecting to Database..." />;
  }

  // Show error message if data fetch fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",

        background: "rgb(210, 236, 255)",
        paddingTop: "1rem",
        paddingLeft: "2rem",
        paddingBottom: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* Add blur effect when overlay is open employee pop*/}
      <div
        style={{
          filter: showEmployeeOverlay ? "blur(4px)" : "none",
          transition: "filter 0s ease",
          width: "100%",
          height: showEmployeeOverlay ? "100vh" : "auto",
          overflow: showEmployeeOverlay ? "hidden" : "auto",
        }}
      >
        {/* Analytics Container */}
        <div
          style={{
            width: "100%",
            maxWidth: "95%",
            display: "flex",
            gap: "1rem",
            marginBottom: "1rem",
            marginTop: "0rem",
            flexWrap: "wrap",
            marginLeft: "5rem",
            marginRight: "2rem",
            boxSizing: "border-box",
          }}
        >
          {/* LineChart card */}
          <div
            style={{
              width: "100%",
              minWidth: "300px",
              flex: 3,
              height: "700px",
              backgroundColor: "white",
              borderRadius: "12px",

              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2
              style={{
                fontSize: "1.9rem",
                fontWeight: "700",
                color: "#333",
                marginLeft: "1rem",
                marginBottom: "1rem",
              }}
            >
              Employee Analytics
            </h2>

            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <LineChart />
            </div>
          </div>

          {/* PieChart card */}
          <div
            style={{
              width: "100%",
              minWidth: "300px",
              flex: 1,
              backgroundColor: "white",
              borderRadius: "12px",

              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <h2
              style={{
                fontSize: "1.7rem",
                fontWeight: "700",
                color: "#333",
                marginBottom: "1rem",
              }}
            >
              Employee Blood Groups
            </h2>
            <div
              style={{
                flex: 1,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PieChart />
            </div>
          </div>
        </div>

        {/* Main Content Card containing Filter and Searchbar/Table */}
        <div
          style={{
            width: "100%",
            maxWidth: "95%",
            marginLeft: "5rem",
            marginRight: "2rem",
            marginTop: "1rem",
            backgroundColor: "white",
            borderRadius: "12px",

            padding: "1.5rem",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Inner container for Filter and Searchbar content */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {/* Filter component */}
            <div
              style={{
                width: "100%",
                maxWidth: "450px",
                flex: "1 1 300px",
                minWidth: "0",
              }}
            >
              <Filter
                employeeData={employeeData}
                onApplyFilters={applyFilters}
                currentFilters={filters}
              />
            </div>

            {/* Searchbar and Table content - takes remaining space */}
            <div
              style={{
                flex: "1 1 600px",
                minWidth: "300px",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <Searchbar
                employees={filteredEmployees}
                onEmployeeClick={handleEmployeeClick}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Overlay pop up */}
      {showEmployeeOverlay && selectedEmployee && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeOverlay();
            }
          }}
        >
          <div
            style={{
              position: "relative",
              width: "80%",
              maxWidth: "90rem",
              height: "88%",
              backgroundColor: "white",
              borderRadius: "29px",
              boxShadow: "7px 10px 25px rgba(0, 0, 0, 0.46)",
              overflow: "hidden",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeOverlay}
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgb(243, 133, 133)";
                e.currentTarget.style.color = "rgb(0, 0, 0)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgb(255, 255, 255)";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiX size={20} />
            </button>
            <EmpPage
              employee={selectedEmployee}
              allowExpand={isAdmin}
              indianOilLogo={IndianOilLogo}
             
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

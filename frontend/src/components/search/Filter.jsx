// Import necessary dependencies from React and libraries
import React, { useState, useEffect } from "react"; // React for building UI, useState and useEffect for state and lifecycle
import { FiX } from "react-icons/fi"; // Feather icon for close button (unused in this code)
import Slider from "@mui/material/Slider"; // Material-UI Slider for age range filter
import { motion } from "framer-motion"; // Framer Motion for animations
import "../../index.css"; // Import global CSS styles

// Define the Filter component, accepting props for configuration
const Filter = ({ employeeData, onApplyFilters, currentFilters }) => {
  // Initialize state for local filter selections
  const [localFilters, setLocalFilters] = useState({
    divisions: currentFilters.divisions, // Selected divisions
    designations: currentFilters.designations, // Selected designations
    functions: currentFilters.functions, // Selected functions
    genders: currentFilters.genders, // Selected genders
    ageRange: currentFilters.ageRange || [0, 100], // Age range filter
    locations: currentFilters.locations || [], // Selected locations
    grades: currentFilters.grades || [], // Selected grades
    bloodGroups: currentFilters.bloodGroups || [], // Selected blood groups
  });

  // State for designation search input
  const [designationSearch, setDesignationSearch] = useState(""); // Search term for filtering designations

  // Extract unique grades from employee data
  const grades = [
    ...new Set(
      employeeData
        .map((e) => e.subgroupCode?.slice(-1)) // Get last character of subgroupCode
        .filter(Boolean) // Remove falsy values
    ),
  ].sort(); // Sort alphabetically

  // Extract unique filter options from employee data
  const divisions = [...new Set(employeeData.map((e) => e.division))]; // Unique divisions
  const designations = [...new Set(employeeData.map((e) => e.designation))]; // Unique designations
  const functions = [...new Set(employeeData.map((e) => e.function))]; // Unique functions
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]; // Static list of blood groups
  const genders = ["Male", "Female"]; // Static list of genders
  const locations = [
    ...new Set(employeeData.map((e) => e.location).filter(Boolean)), // Unique locations
  ].sort(); // Sort alphabetically

  // Filter designations based on search input
  const filteredDesignations = designations.filter((designation) =>
    designation.toLowerCase().includes(designationSearch.toLowerCase())
  );

  // Apply filters when localFilters change
  useEffect(() => {
    // Check if localFilters differ from currentFilters
    if (JSON.stringify(localFilters) !== JSON.stringify(currentFilters)) {
      onApplyFilters(localFilters); // Call parent callback with updated filters
    }
  }, [localFilters, currentFilters, onApplyFilters]); // Dependencies for useEffect

  // Handle button clicks for filter categories
  const handleButtonClick = (category, value) => {
    setLocalFilters((prev) => {
      // Toggle value in the category array
      const newValues = prev[category].includes(value)
        ? prev[category].filter((v) => v !== value) // Remove if already selected
        : [...prev[category], value]; // Add if not selected
      return { ...prev, [category]: newValues }; // Update state
    });
  };

  // Handle age range slider changes
  const handleAgeRangeChange = (event, newValue) => {
    setLocalFilters((prev) => ({
      ...prev,
      ageRange: newValue, // Update age range
    }));
  };

  // Clear all filters
  const handleClearAll = () => {
    const clearedFilters = {
      divisions: [], // Clear divisions
      designations: [], // Clear designations
      functions: [], // Clear functions
      genders: [], // Clear genders
      ageRange: [0, 100], // Reset age range
      locations: [], // Clear locations
      grades: [], // Clear grades
      bloodGroups: [], // Clear blood groups
    };
    setLocalFilters(clearedFilters); // Apply cleared filters
    setDesignationSearch(""); // Clear designation search
  };

  // State for hover effect (unused in this code)
  const [isHovered, setIsHovered] = useState(false);

  // Render the component
  return (
    // Animated container for filter panel
    <motion.div
      initial={{ x: -20, opacity: 0 }} // Start off-screen and transparent
      animate={{ x: 0, opacity: 1 }} // Slide in and become opaque
      transition={{ duration: 0.5, delay: 0.2 }} // Animation settings
      style={{
        width: "100%", // Full width
        maxWidth: "450px", // Maximum width
        padding: "2rem", // Padding
        backgroundColor: "white", // White background
        borderRadius: "12px", // Rounded corners
      }}
    >
      {/* Header section */}
      <div
        style={{
          display: "flex", // Flexbox for layout
          justifyContent: "space-between", // Space out title and button
          alignItems: "center", // Vertically center
          marginBottom: "1.5rem", // Space below
        }}
      >
        <h2
          style={{
            fontSize: "1.7rem", // Title size
            fontWeight: "700", // Bold text
            color: "#333", // Dark gray color
          }}
        >
          Filter By :
        </h2>
        {/* Clear filters button */}
        <motion.button
          whileHover={{ scale: 1.05 }} // Scale up on hover
          whileTap={{ scale: 0.95 }} // Scale down on click
          style={{
            display: "flex", // Flexbox for button content
            alignItems: "center", // Center content
            gap: "0.5rem", // Space between text and icon
            padding: "0.5rem 1.5rem", // Padding
            borderRadius: "20px", // Pill shape
            border: "none", // No border
            backgroundColor: "#3b82f6", // Blue background
            color: "white", // White text
            fontSize: "1.2rem", // Larger text
            cursor: "pointer", // Pointer cursor
            transition: "all 0.2s ease", // Smooth transition
          }}
          onClick={handleClearAll} // Trigger clear filters
        >
          Clear
        </motion.button>
      </div>

      {/* Age Range Filter */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Age Range: {localFilters.ageRange[0]} - {localFilters.ageRange[1]}
        </h3>
        {/* Material-UI Slider for age range */}
        <Slider
          value={localFilters.ageRange} // Current age range
          onChange={handleAgeRangeChange} // Update on change
          valueLabelDisplay="auto" // Show value labels
          min={0} // Minimum age
          max={100} // Maximum age
          sx={{
            color: "#3b82f6", // Blue slider
            "& .MuiSlider-thumb": {
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0px 0px 0px 8px rgba(59, 130, 246, 0.16)", // Hover/focus effect
              },
            },
          }}
        />
      </div>

      {/* Gender Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Gender
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
          }}
        >
          {genders.map((gender) => (
            // Button for each gender
            <motion.button
              whileHover={{ scale: 1.08 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
              key={gender} // Unique key
              onClick={() => handleButtonClick("genders", gender)} // Toggle gender
              style={{
                padding: "0.5rem 1rem", // Padding
                borderRadius: "20px", // Pill shape
                border: "1px solid #d1d5db", // Gray border
                backgroundColor: localFilters.genders.includes(gender)
                  ? "#3b82f6" // Blue if selected
                  : "#f3f4f6", // Light gray if not
                color: localFilters.genders.includes(gender)
                  ? "white" // White text if selected
                  : "#374151", // Dark gray if not
                fontSize: "0.9rem", // Smaller text
                cursor: "pointer", // Pointer cursor
                transition: "all 0.05s ease", // Fast transition
              }}
            >
              {gender}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Division Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Division
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
          }}
        >
          {divisions.map((division) => (
            // Button for each division
            <motion.button
              whileHover={{ scale: 1.08 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
              key={division} // Unique key
              onClick={() => handleButtonClick("divisions", division)} // Toggle division
              style={{
                padding: "0.5rem 1rem", // Padding
                borderRadius: "20px", // Pill shape
                border: "1px solid #d1d5db", // Gray border
                backgroundColor: localFilters.divisions.includes(division)
                  ? "#3b82f6" // Blue if selected
                  : "#f3f4f6", // Light gray if not
                color: localFilters.divisions.includes(division)
                  ? "white" // White text if selected
                  : "#374151", // Dark gray if not
                fontSize: "0.9rem", // Smaller text
                cursor: "pointer", // Pointer cursor
                transition: "all 0.05s ease", // Fast transition
              }}
            >
              {division}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Location
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
            maxHeight: "280px", // Limit height
            overflowY: "auto", // Scrollable
            padding: "0.5rem", // Inner padding
            scrollbarWidth: "thin", // Thin scrollbar
            scrollbarColor: "#3b82f6 #f3f4f6", // Blue scrollbar
          }}
        >
          {locations.map((location) => (
            // Button for each location
            <motion.button
              whileHover={{ scale: 1.08 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
              key={location} // Unique key
              onClick={() => handleButtonClick("locations", location)} // Toggle location
              style={{
                padding: "0.5rem 1rem", // Padding
                borderRadius: "20px", // Pill shape
                border: "1px solid #d1d5db", // Gray border
                backgroundColor: localFilters.locations?.includes(location)
                  ? "#3b82f6" // Blue if selected
                  : "#f3f4f6", // Light gray if not
                color: localFilters.locations?.includes(location)
                  ? "white" // White text if selected
                  : "#374151", // Dark gray if not
                fontSize: "0.9rem", // Smaller text
                cursor: "pointer", // Pointer cursor
                transition: "all 0.2s ease", // Smooth transition
              }}
            >
              {location}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Grade Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Grade
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
          }}
        >
          {grades
            .sort((a, b) => {
              const aIsLetter = isNaN(a); // Check if a is a letter
              const bIsLetter = isNaN(b); // Check if b is a letter
              if (aIsLetter === bIsLetter) {
                return a.localeCompare(b); // Sort alphabetically if both are same type
              }
              if (aIsLetter && !bIsLetter) {
                return -1; // Letters before numbers
              }
              return 1; // Numbers after letters
            })
            .map((grade) => (
              // Button for each grade
              <motion.button
                whileHover={{ scale: 1.08 }} // Scale up on hover
                whileTap={{ scale: 0.95 }} // Scale down on click
                key={grade} // Unique key
                onClick={() => handleButtonClick("grades", grade)} // Toggle grade
                style={{
                  padding: "0.5rem 1rem", // Padding
                  borderRadius: "20px", // Pill shape
                  border: "1px solid #d1d5db", // Gray border
                  backgroundColor: localFilters.grades.includes(grade)
                    ? "#3b82f6" // Blue if selected
                    : "#f3f4f6", // Light gray if not
                  color: localFilters.grades.includes(grade)
                    ? "white" // White text if selected
                    : "#374151", // Dark gray if not
                  fontSize: "0.9rem", // Smaller text
                  cursor: "pointer", // Pointer cursor
                  transition: "all 0.2s ease", // Smooth transition
                }}
              >
                {grade}
              </motion.button>
            ))}
        </div>
      </div>

      {/* Blood Group Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Blood Group
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
          }}
        >
          {bloodGroups.map((group) => (
            // Button for each blood group
            <motion.button
              whileHover={{ scale: 1.08 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
              key={group} // Unique key
              onClick={() => handleButtonClick("bloodGroups", group)} // Toggle blood group
              style={{
                padding: "0.5rem 1rem", // Padding
                borderRadius: "20px", // Pill shape
                border: "1px solid #d1d5db", // Gray border
                backgroundColor: localFilters.bloodGroups.includes(group)
                  ? "#3b82f6" // Blue if selected
                  : "#f3f4f6", // Light gray if not
                color: localFilters.bloodGroups.includes(group)
                  ? "white" // White text if selected
                  : "#374151", // Dark gray if not
                fontSize: "0.9rem", // Smaller text
                cursor: "pointer", // Pointer cursor
                transition: "all 0.2s ease", // Smooth transition
              }}
            >
              {group}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Designation Filter */}
      <div style={{ marginBottom: "2rem" }}>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#333",
            marginBottom: "0.5rem",
          }}
        >
          Designation
        </h3>

        {/* Search Bar for Designations */}
        <div style={{ marginBottom: "0.75rem", position: "relative" }}>
          <input
            type="text"
            placeholder="Search designations..."
            value={designationSearch}
            onChange={(e) => setDesignationSearch(e.target.value)}
            style={{
              width: "90%",
              padding: "0.5rem 0.75rem",
              paddingRight: "2rem",
              borderRadius: "20px",
              border: "1px solid #d1d5db",
              fontSize: "0.9rem",
              outline: "none",
              transition: "all 0.05s",
              boxSizing: "border-box",
            }}
          />
          {designationSearch && (
            <button
              onClick={() => setDesignationSearch("")}
              style={{
                position: "absolute",
                right: "0.5rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
              }}
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            maxHeight: "280px",
            overflowY: "auto",
            padding: "0.5rem",
            scrollbarWidth: "thin",
            scrollbarColor: "#3b82f6 #f3f4f6",
          }}
        >
          {filteredDesignations.length > 0 ? (
            filteredDesignations.map((designation) => (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                key={designation}
                onClick={() => handleButtonClick("designations", designation)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  border: "1px solid #d1d5db",
                  backgroundColor: localFilters.designations.includes(
                    designation
                  )
                    ? "#3b82f6"
                    : "#f3f4f6",
                  color: localFilters.designations.includes(designation)
                    ? "white"
                    : "#374151",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.05s ease",
                  flexShrink: 0,
                }}
              >
                {designation}
              </motion.button>
            ))
          ) : (
            <div
              style={{
                width: "100%",
                textAlign: "center",
                color: "#6b7280",
                padding: "0.5rem",
              }}
            >
              No designations found
            </div>
          )}
        </div>
      </div>

      {/* Function Filter */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3
          style={{
            fontSize: "1rem", // Subtitle size
            fontWeight: "600", // Bold text
            color: "#333", // Dark gray color
            marginBottom: "0.5rem", // Space below
          }}
        >
          Function
        </h3>
        <div
          style={{
            display: "flex", // Flexbox for buttons
            flexWrap: "wrap", // Wrap buttons
            gap: "0.5rem", // Space between buttons
          }}
        >
          {functions.map((func) => (
            // Button for each function
            <motion.button
              whileHover={{ scale: 1.08 }} // Scale up on hover
              whileTap={{ scale: 0.95 }} // Scale down on click
              key={func} // Unique key
              onClick={() => handleButtonClick("functions", func)} // Toggle function
              style={{
                padding: "0.5rem 1rem", // Padding
                borderRadius: "20px", // Pill shape
                border: "1px solid #d1d5db", // Gray border
                backgroundColor: localFilters.functions.includes(func)
                  ? "#3b82f6" // Blue if selected
                  : "#f3f4f6", // Light gray if not
                color: localFilters.functions.includes(func)
                  ? "white" // White text if selected
                  : "#374151", // Dark gray if not
                fontSize: "0.9rem", // Smaller text
                cursor: "pointer", // Pointer cursor
                transition: "all 0.05s ease", // Fast transition
              }}
            >
              {func}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Export the component for use in other parts of the application
export default Filter;

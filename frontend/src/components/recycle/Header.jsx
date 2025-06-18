import React, { useState, useRef } from "react";
import { FiTrash2, FiSearch, FiChevronDown } from "react-icons/fi";
import { motion } from "framer-motion";

// Header component for the Recycle Bin section with search and filter controls
const Header = ({
  searchTerm, // Current search term
  setSearchTerm, // Function to update search term
  searchBy, // Current search field (name/empNo)
  setSearchBy, // Function to update search field
  handleSelectCount, // Function to handle bulk selection
  timeFilter, // Current time filter
  setTimeFilter, // Function to update time filter
  clearSelection, // Function to clear selections
}) => {
  // State for dropdown visibility
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const selectRef = useRef(null); // Ref for the select dropdown

  // Handler for search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handler for bulk selection
  const handleSelection = (e) => {
    const count = parseInt(e.target.value);
    if (count) {
      handleSelectCount(count);
      // Reset select dropdown after selection
      if (selectRef.current) {
        selectRef.current.value = "";
      }
    }
  };

  return (
    // Animated header container
    <motion.div
      initial={{ y: -10, opacity: 1 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "95%",
        height: "80px",
        margin: "0 auto 25px auto",
        backgroundColor: "white",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
        marginLeft: "7rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      }}
      onMouseLeave={() => setIsFilterOpen(false)}
    >
      {/* Left section - Title and icon */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <FiTrash2 size={28} color="rgba(24, 25, 26, 0.79)" />
        <h1
          style={{
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "rgba(3, 3, 3, 0.76)",
            margin: 0,
            letterSpacing: "1px",
          }}
        >
          Recycle Bin
        </h1>
      </div>

      {/* Middle section - Search controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          width: "50%",
        }}
      >
        {/* Combined search box with time filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            padding: "0 12px",
            flexGrow: 1,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#2A88D4";
            e.currentTarget.style.boxShadow =
              "0 2px 12px rgba(42, 136, 212, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
          }}
        >
          {/* Time dropdown inside the box */}
          <select
            style={{
              padding: "8px 8px",
              border: "none",
              backgroundColor: "transparent",
              color: "#4b5563",
              fontSize: "1.3rem",
              cursor: "pointer",
              height: "100%",
              outline: "none",
              marginRight: "10px",
            }}
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
          </select>

          {/* Search input */}
          <div style={{ position: "relative", flexGrow: 1 }}>
            <FiSearch
              size={20}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "rgba(0, 0, 0, 0.73)",
                zIndex: 1,
              }}
            />
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                padding: "8px 12px 8px 45px",
                border: "none",
                fontSize: "1.4rem",
                color: "rgba(0, 0, 0, 0.73)",
                backgroundColor: "transparent",
                width: "100%",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Search-by dropdown outside the search box */}
        <div style={{ position: "relative", marginLeft: "10px" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(0, 0, 0, 0.27)",
              backgroundColor: "white",
              color: "#4b5563",
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span>{searchBy}</span>
            <FiChevronDown />
          </button>

          {isFilterOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                zIndex: 10,
                width: "150px",
                marginTop: "5px",
              }}
            >
              {["name", "empNo"].map((option) => (
                <motion.div
                  key={option}
                  whileHover={{
                    backgroundColor: "#f3f4f6",
                    scale: 1,
                    transition: { duration: 0.1 },
                  }}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    backgroundColor:
                      searchBy === option ? "#f3f4f6" : "transparent",
                    borderRadius: "8px",
                    margin: "2px",
                  }}
                  onClick={() => {
                    setSearchBy(option);
                    setIsFilterOpen(false);
                  }}
                >
                  {option === "empNo"
                    ? "Employee No"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Right side - Select dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <select
          ref={selectRef}
          onChange={handleSelection}
          defaultValue=""
          style={{
            padding: "8px 12px",
            fontSize: "1.3rem",
            borderRadius: "6px",
            border: "1px solid #e0e0e0",
            cursor: "pointer",
            backgroundColor: "white",
            color: "#333",
            width: "120px",
            transition: "all 0.2s ease",
            ":hover": {
              borderColor: "#2A88D4",
            },
            ":focus": {
              outline: "none",
              borderColor: "#2A88D4",
              boxShadow: "0 0 0 2px rgba(42, 136, 212, 0.2)",
            },
          }}
        >
          <option value="" disabled>
            Select
          </option>
          <option value="5">Select 5</option>
          <option value="10">Select 10</option>
          <option value="20">Select 20</option>
        </select>

        {/* clear button */}
        <button
          onClick={clearSelection}
          style={{
            padding: "8px 16px",
            fontSize: "1.3rem",
            borderRadius: "6px",
            border: "1px solid #e0e0e0",
            backgroundColor: "white",
            color: "#333",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f5f5f5";
            e.currentTarget.style.borderColor = "#ccc";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "white";
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
};

export default Header;

import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

// Component for displaying a table of deleted/recycled employee records
const BinTable = ({
  items, // Array of employee items to display
  selectAll, // Boolean indicating if all items are selected
  toggleSelectAll, // Function to toggle select-all state
  toggleSelectItem, // Function to toggle selection of individual items
  selectedCount, // Number of currently selected items
  totalCount, // Total count of all available items
  loadMore, // Function to load more items
  hasMore, // Boolean indicating if more items are available
  loading, // Loading state indicator
  error, // Error state
}) => {
  return (
    // Main container for the table
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Table Header - Contains column labels and select-all checkbox */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "0.5fr 1fr 1fr 1fr 1fr 0.7fr",
          padding: "16px 24px",
          backgroundColor: "#2A88D4",
          borderBottom: "1px solid #e0e0e0",
          fontWeight: "500",
          color: "white",
          fontFamily: "'Segoe UI', sans-serif",
          fontSize: "1.2rem",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        {/* Select-all checkbox */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
            style={{
              marginRight: "10px",
              width: "18px",
              height: "18px",
              cursor: "pointer",
            }}
          />
          <span>Select All</span>
        </div>
        <div>Employee No</div>
        <div>Name</div>
        <div>Deleted On</div>
        <div>Designation</div>
        <div>Type</div>
      </div>
      {/* Error state display */}
      {error && (
        <div
          style={{
            flex: 1,
            color: "red",
          }}
        >
          Error loading data
        </div>
      )}

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3rem",
            flex: 1,
            height: "200px",
          }}
        >
          <CircularProgress size={40} />
        </div>
      )}

      {/* Table Body - Displays the actual employee records */}
      {!loading && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "#ccc transparent",
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.1 }}
              style={{
                display: "grid",
                gridTemplateColumns: "0.5fr 1fr 1fr 1fr 1fr 0.7fr",
                padding: "14px 24px",
                borderBottom: "1px solid rgb(231, 231, 231)",
                fontSize: "1.2rem",
                fontWeight: "500",
                color: "rgba(0, 0, 0, 0.81)",
                alignItems: "center",
                backgroundColor: item.selected ? "#f0f7ff" : "transparent",
                transition: "all 0.2s ease",
              }}
              onClick={() => toggleSelectItem(item.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = item.selected
                  ? "#e1efff"
                  : "#f9f9f9")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = item.selected
                  ? "#f0f7ff"
                  : "transparent")
              }
            >
              {/* Checkbox for individual selection */}
              <div onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelectItem(item.id)}
                  style={{
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                />
              </div>
              {/* Employee data columns */}
              <div>{item.empNo}</div>
              <div>{item.name}</div>
              <div>
                {new Date(item.deletedOn).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div>{item.designation}</div>

              {/* Employee type with styled badge */}
              {item.type && (
                <div>
                  <span
                    style={{
                      padding: "5px 15px",
                      borderRadius: "18px",
                      backgroundColor:
                        item.type === "White Collar"
                          ? "rgba(180, 182, 184, 0.29)"
                          : "rgba(25, 156, 216, 0.84)",
                      color:
                        item.type === "White Collar"
                          ? "rgb(0, 0, 0)"
                          : "rgb(255, 255, 255)",
                      fontSize: "1.1rem",
                      fontWeight: "500",
                    }}
                  >
                    {item.type}
                  </span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Load More button - appears when more items are available */}
          {hasMore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "16px",
                borderBottom: "1px solid rgba(0, 0, 0, 0.16)",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMore}
                style={{
                  padding: "8px 24px",
                  backgroundColor: "#2A88D4",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                Load More
              </motion.button>
            </motion.div>
          )}
        </div>
      )}

      {/* Table Footer - Shows selection and total counts */}
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          padding: "15px 20px",
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#f8f9fa",
          fontSize: "1.1rem",
          color: "#555",
        }}
      >
        <div>
          SELECTED: {selectedCount} / {items.length}
        </div>
        <div style={{ marginLeft: "3rem" }}>TOTAL: {totalCount}</div>
      </div>
    </div>
  );
};

export default BinTable;

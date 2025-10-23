import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/recycle/Header";
import BinTable from "../components/recycle/Bintable";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import {
  restoreEmployees,
  decrementRecycleCount,
} from "../store/employeeSlice";

const Recycle = () => {
  const dispatch = useDispatch();

  // State for storing recycled items
  const [recycledItems, setRecycledItems] = useState([]);

  // Loading state indicator
  const [loading, setLoading] = useState(true);

  // Error handling state
  const [error, setError] = useState(null);

  // States for operation loading indicators
  const [deleting, setDeleting] = useState(false);
  const [recovering, setRecovering] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  // Selection management states
  const [selectAll, setSelectAll] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState({});
  const [lastSelectedIndex, setLastSelectedIndex] = useState(0);

  // Time filter state
  const [timeFilter, setTimeFilter] = useState("all");

  // Modal visibility states
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRecoverConfirm, setShowRecoverConfirm] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(15);

  // Fetches recycled items on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/employees/getRecycledData`
        );
        setRecycledItems(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch recycled data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handles batch selection of items
  const handleSelectCount = (count) => {
    const newSelected = { ...selectedEmployees };
    const newItems = [...recycledItems];

    let selectedInThisBatch = 0;
    let i = lastSelectedIndex;

    while (selectedInThisBatch < count && i < newItems.length) {
      if (!newItems[i].selected) {
        newSelected[newItems[i].id] = true;
        newItems[i].selected = true;
        selectedInThisBatch++;
      }
      i++;
    }

    setLastSelectedIndex(i >= newItems.length ? 0 : i);
    setSelectedEmployees(newSelected);
    setRecycledItems(newItems);
  };

  // Toggles select all checkbox
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelected = {};
    const updatedItems = recycledItems.map((item) => ({
      ...item,
      selected: newSelectAll,
    }));

    if (newSelectAll) {
      recycledItems.forEach((item) => {
        newSelected[item.id] = true;
      });
    }

    setSelectedEmployees(newSelected);
    setRecycledItems(updatedItems);
  };

  // Toggles selection for individual items
  const toggleSelectItem = (id) => {
    const newSelected = { ...selectedEmployees };
    newSelected[id] = !newSelected[id];
    setSelectedEmployees(newSelected);

    const allSelected =
      Object.keys(newSelected).length === recycledItems.length &&
      Object.values(newSelected).every(Boolean);
    setSelectAll(allSelected);

    setRecycledItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedCount = Object.keys(selectedEmployees).filter(
    (id) => selectedEmployees[id]
  ).length;

  // Filters items by deletion time
  const filterByTime = (list) => {
    if (timeFilter === "all") return list;

    const now = new Date();
    const days = timeFilter === "7days" ? 7 : 30;

    return list.filter((item) => {
      const [year, month, day] = item.deletedOn.split("-").map(Number);
      const deletedDate = new Date(year, month - 1, day);
      const diffDays = (now - deletedDate) / (1000 * 60 * 60 * 24);
      return diffDays <= days;
    });
  };

  // Filters items by search term
  const filteredBySearch = recycledItems.filter((item) => {
    const searchField = searchBy === "empId" ? "empNo" : searchBy;
    return item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Combined filtered items
  const filteredItems = filterByTime(filteredBySearch);
  // Paginated visible items
  const visibleItems = filteredItems.slice(0, visibleCount);

  // Clears current selection
  const clearSelection = () => {
    setSelectAll(false);
    setSelectedEmployees({});
    setRecycledItems((prevItems) =>
      prevItems.map((item) => ({ ...item, selected: false }))
    );
  };
  // Permanently deletes selected items
  const handleDelete = async () => {
    const selectedIds = Object.keys(selectedEmployees)
      .filter((id) => selectedEmployees[id])
      .map(Number);

    if (selectedIds.length === 0) return;

    try {
      setDeleting(true);
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/employees/deleteForever`, {
        data: { ids: selectedIds },
      });

      setRecycledItems((prevItems) =>
        prevItems.filter((item) => !selectedIds.includes(item.id))
      );
      setSelectedEmployees({});
      setSelectAll(false);
      setShowDeleteConfirm(false);

      // Dispatch action to update recycle count
      dispatch(decrementRecycleCount(selectedIds.length));

      toast.success(`${selectedIds.length} items deleted permanently`);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete items");
    } finally {
      setDeleting(false);
    }
  };

  // Recovers selected items
  const handleRecover = async () => {
    const selectedIds = Object.keys(selectedEmployees)
      .filter((id) => selectedEmployees[id])
      .map(Number);

    if (selectedIds.length === 0) return;

    try {
      setRecovering(true);

      const resultAction = await dispatch(restoreEmployees(selectedIds));

      if (restoreEmployees.fulfilled.match(resultAction)) {
        setRecycledItems((prevItems) =>
          prevItems.filter((item) => !selectedIds.includes(item.id))
        );
        setSelectedEmployees({});
        setSelectAll(false);
        setShowRecoverConfirm(false);

        toast.success(`${selectedIds.length} item(s) recovered successfully`);
      } else {
        throw new Error(resultAction.error.message);
      }
    } catch (err) {
      console.error("Recover failed:", err);
      toast.error("Failed to recover items");
    } finally {
      setRecovering(false);
    }
  };
  // Loads more items for pagination
  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 15);
  };

  useEffect(() => {
    setVisibleCount(15);
  }, [searchTerm, searchBy, timeFilter]);

  return (
    // Main container with gradient background
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        background:
          "linear-gradient(135deg,rgb(225, 236, 245), rgb(212, 233, 248) 100%)",
        padding: "30px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header component with search and filters */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
        handleSelectCount={handleSelectCount}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        clearSelection={clearSelection}
      />

      {/* Main table container */}
      <div
        style={{
          width: "95%",
          height: "75vh",
          margin: "0 auto 25px auto",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          marginLeft: "7rem",
          transition: "all 0.3s ease",
          ":hover": {
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.12)",
          },
        }}
      >
        <BinTable
          items={filteredItems.slice(0, visibleCount)}
          selectAll={selectAll}
          toggleSelectAll={toggleSelectAll}
          toggleSelectItem={toggleSelectItem}
          selectedCount={selectedCount}
          totalCount={filteredItems.length}
          loadMore={loadMore}
          hasMore={visibleCount < filteredItems.length}
          loading={loading}
          error={error}
        />
      </div>

      <div
        style={{
          width: "95%",
          height: "7vh",
          margin: "0 auto",
          backgroundColor: "rgba(243, 240, 240, 0.6)",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "1.2rem",
          fontWeight: "500",
          color: "#333",
          marginLeft: "7rem",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", gap: "15px" }}>
          <motion.button
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => selectedCount > 0 && setShowRecoverConfirm(true)}
            disabled={selectedCount === 0}
            style={{
              padding: "8px 20px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid rgba(8, 8, 8, 0.33)",
              backgroundColor:
                selectedCount === 0 ? "rgb(33, 141, 212)" : "rgb(33, 141, 212)",
              color: "white",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.backgroundColor = "rgb(29, 163, 52)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.backgroundColor = "rgb(33, 141, 212)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            Recover
          </motion.button>
          <motion.button
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => selectedCount > 0 && setShowDeleteConfirm(true)}
            disabled={selectedCount === 0}
            style={{
              padding: "8px 20px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid rgba(19, 18, 18, 0.36)",
              backgroundColor:
                selectedCount === 0 ? "rgb(33, 141, 212)" : "rgb(33, 141, 212)",
              color: "white",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.backgroundColor = "rgb(209, 32, 32)";
                e.currentTarget.style.transform = "scale(1.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCount > 0) {
                e.currentTarget.style.backgroundColor = "rgb(33, 141, 212)";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            Delete
          </motion.button>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.1 }}
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
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "8px",
                width: "400px",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
                Confirm Permanent Delete
              </h3>
              <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
                Do you want to permanently delete {selectedCount} selected
                Employees?
              </p>
              {deleting ? (
                <div style={{ margin: "20px 0", color: "#2A88D4" }}>
                  Deleting...
                </div>
              ) : (
                ""
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    transform: "scale(1)",
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recover confirmation modal */}
        {showRecoverConfirm && (
          <motion.div
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.1 }}
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
            <div
              style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "8px",
                width: "400px",
                textAlign: "center",
              }}
            >
              <h3 style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>
                Confirm Recover
              </h3>
              <p style={{ marginBottom: "2rem", fontSize: "1.2rem" }}>
                Do you want to recover {selectedCount} selected employee(s)?
              </p>
              {recovering ? (
                <div style={{ margin: "20px 0", color: "#2A88D4" }}>
                  Recovering...
                </div>
              ) : (
                ""
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleRecover}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Yes, Recover
                </button>
                <button
                  onClick={() => setShowRecoverConfirm(false)}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Recycle;

import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import LogoHeader from "./LogoHeader";
import ChangePasswordModal from "./ChangePasswordModel";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditProfile from "./EditProfile";

import RouterOutlinedIcon from "@mui/icons-material/RouterOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRecycleCount,
  fetchRequestCount,
} from "../../store/employeeSlice";
import EditNoteIcon from "@mui/icons-material/EditNote";

// Utility function to get user initials from name
function getInitials(name) {
  if (!name) return "";
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}

// Sidebar component for navigation
function Sidebar() {
  const dispatch = useDispatch(); // Redux dispatch
  const { recycleCount, requestCount } = useSelector((state) => state.employee); // Redux state for counts
  const currentUser = JSON.parse(localStorage.getItem('authState')); 
  const isAdmin = currentUser.isAdmin; 

  // State for recycle and request counts
  const [Recycle_items, setRecycleItems] = useState(0);
  const [Request_items, setRequestItems] = useState(0);

  // Fetch recycle and request counts on mount
  useEffect(() => {
    dispatch(fetchRecycleCount())
      .unwrap()
      .then(() => {
        dispatch(fetchRequestCount());
      })
      .catch((error) => {
        console.error("Failed to fetch counts:", error);
      });
  }, [dispatch]);

  // Update local state with Redux counts
  useEffect(() => {
    setRecycleItems(recycleCount);
    setRequestItems(requestCount);
  }, [recycleCount, requestCount]);

  // State for UI interactions
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip visibility
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Tooltip position
  const [hoverTimeout, setHoverTimeout] = useState(null); // Hover timeout for tooltip
  const [showModal, setShowModal] = useState(false); // Change password modal visibility
  const navigate = useNavigate(); // Navigation hook
  const [showEditModal, setShowEditModal] = useState(false); // Edit profile modal visibility

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authState');
    navigate("/");
  };

  // Show tooltip after 1-second hover
  const handleMouseEnter = (e) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);

    setHoverTimeout(
      setTimeout(() => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
        setShowTooltip(true);
      }, 1000)
    );
  };

  // Hide tooltip on mouse leave
  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    setShowTooltip(false);
  };

  // Update tooltip position on mouse move
  const handleMouseMove = (e) => {
    if (showTooltip) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // Animation variants for underline effect
  const underlineVariants = {
    hover: {
      width: "100%",
      transition: { duration: 0.3, ease: "easeOut" },
    },
    rest: {
      width: "0%",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
    };
  }, [hoverTimeout]);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        className="sidebar"
        style={{
          background:
            "linear-gradient(125deg, rgba(15,7,88,0.95) 10%, rgba(0, 153, 255, 0.7) 60%,rgb(160, 212, 221) 100%)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          color: "white",
          padding: "1rem",
          position: "fixed",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 100,
          transition: "width 0.3s ease",
          overflowX: "hidden",
          borderRadius: "0 15px 20px 0",
          boxShadow: "7px 7px 25px rgba(0, 0, 0, 0.5)",
        }}
        onMouseLeave={() => setShowDropdown(false)}
      >
        {/* Logo */}
        <NavLink to="/app/home" className="logo-section">
          <div className="logo">
            <LogoHeader />
          </div>
        </NavLink>

        {/* Separator */}
        <div className="separator" />

        {/* User Info */}
        <div
          className="user-section"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="user-info">
            <div
              className="user-img"
              style={{
                backgroundColor: "rgb(211, 96, 43)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(currentUser.name)}
            </div>
            <div
              className="user-text"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <p className="username">{currentUser.name}</p>
              <p className="subtext">{currentUser.email}</p>
            </div>
          </div>
          <ArrowDropDownOutlinedIcon
            className={`dropdown-icon ${showDropdown ? "rotate" : ""}`}
          />
        </div>

        {showDropdown && (
          <motion.div
            className="dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={() => setTimeout(() => setShowDropdown(false), 700)}
          >
            <button
              className="dropdown-item"
              onClick={() => setShowModal(true)}
            >
              <LockResetOutlinedIcon className="dropdown-icon" />
              <span>Change Password</span>
            </button>
            <button
              className="dropdown-item"
              onClick={() => setShowEditModal(true)}
            >
              <EditOutlinedIcon className="dropdown-icon" />
              <span>Edit Profile</span>
            </button>
          </motion.div>
        )}

        {/* Separator */}
        <div className="separator" />

        {/* Menu */}
        <p className="menu-header">Menu</p>
        <nav className="nav-links">
          <NavLink to="/app/home" className="nav-item">
            <HomeOutlinedIcon className="nav-icon" />
            <span className="nav-text">
              Home
              <motion.div
                className="underline"
                variants={underlineVariants}
                initial="rest"
                whileHover="hover"
              />
            </span>
          </NavLink>

          <NavLink to="/app/birthday" className="nav-item">
            <CakeOutlinedIcon className="nav-icon" />
            <span className="nav-text">
              Birthdays
              <motion.div
                className="underline"
                variants={underlineVariants}
                initial="rest"
                whileHover="hover"
              />
            </span>
          </NavLink>

          <NavLink to="/app/search" className="nav-item">
            <ManageSearchOutlinedIcon className="nav-icon" />
            <span className="nav-text">
              Search
              <motion.div
                className="underline"
                variants={underlineVariants}
                initial="rest"
                whileHover="hover"
              />
            </span>
          </NavLink>

          <NavLink to="/app/intercom" className="nav-item">
            <RouterOutlinedIcon className="nav-icon" />
            <span className="nav-text">
              Intercom
              <motion.div
                className="underline"
                variants={underlineVariants}
                initial="rest"
                whileHover="hover"
              />
            </span>
          </NavLink>

          {isAdmin && (
            <>
              <NavLink to="/app/request" className="nav-item">
                <div className="nav-icon-container">
                  <EditNoteIcon className="nav-icon" />
                  {Request_items > 0 && (
                    <span className="notification-badge">{Request_items}</span>
                  )}
                </div>
                <span className="nav-text" style={{ marginLeft: "1.55rem" }}>
                  Requests
                  <motion.div
                    className="underline"
                    variants={underlineVariants}
                    initial="rest"
                    whileHover="hover"
                  />
                </span>
              </NavLink>
              <NavLink to="/app/recycle" className="nav-item">
                <div className="nav-icon-container">
                  <DeleteOutlinedIcon className="nav-icon" />
                  {Recycle_items > 0 && (
                    <span className="notification-badge">{Recycle_items}</span>
                  )}
                </div>
                <span className="nav-text" style={{ marginLeft: "1.55rem" }}>
                  Recycle
                  <motion.div
                    className="underline"
                    variants={underlineVariants}
                    initial="rest"
                    whileHover="hover"
                  />
                </span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Separator */}
        <div className="separator logout-separator" />

        {/* Logout */}
        <button className="logout-button" onClick={handleLogout}>
          <LogoutOutlinedIcon className="nav-icon" />
          <span className="nav-text">Log Out</span>
          <motion.div
            className="underline"
            variants={underlineVariants}
            initial="rest"
            whileHover="hover"
          />
        </button>

        {/* Tooltip */}
        {showTooltip && (
          <div
            className={`tooltip ${showTooltip ? "show" : ""}`}
            style={{
              position: "fixed",
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`,
              zIndex: 1000,
            }}
          >
            <div className="tooltip-content">
              <p className="tooltip-username">{currentUser.name}</p>
              <p className="tooltip-subtext">{currentUser.email}</p>
            </div>
          </div>
        )}
      </aside>

      <main className="main-content">
        <div
          style={{
            filter: showModal ? "blur(4px)" : "none",
            transition: "filter 0.3s ease",
            width: "100%",
            height: "100%",
          }}
        >
          <Outlet />
        </div>
      </main>

      {/* Change Password Modal */}
      {showModal && (
        <ChangePasswordModal
          onClose={() => setShowModal(false)}
          email={currentUser.email}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfile
          onClose={() => setShowEditModal(false)}
          onSubmit={(data) => {
            setShowEditModal(false);
          }}
        />
      )}

      {/* Styles */}
      <style jsx="true">{`
        .sidebar {
          width: 100px;
        }
        .sidebar:hover {
          width: 330px;
          transition: width 0.5s ease;
        }
        /* pratyush edit */
        .notification-badge {
          position: absolute;
          right: -0.9rem;
          top: -0.5rem;
          background-color: #ff4757;
          color: white;
          border-radius: 50%;
          width: 25px;
          height: 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          font-weight: bold;
          z-index: 10;
        }

        /* pratyush edit */
        .sidebar:not(:hover) .notification-badge {
          right: -0.9rem;
          top: -0.5rem;
          width: 25px;
          height: 25px;
          font-size: 0.9rem;
        }

        /* pratyush edit */
        .nav-text {
          position: relative; /* Add this to make the badge position relative to the text */
          display: none;
          padding-bottom: 5px;
          padding-right: 20px; /* Add some padding to prevent text overlap with badge */
        }

        .dropdown {
          background: rgba(0, 153, 255, 0.2);
          backdrop-filter: blur(5px);
          border-radius: 20px;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          width: 100%;
          padding: 0.8rem 1rem;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
        }

        .dropdown-icon {
          font-size: 1.4rem;
          transition: transform 0.2s ease;
        }

        .dropdown-icon.rotate {
          transform: rotate(180deg);
        }

        .main-content {
          width: 100%;
          height: 100%;
        }

        .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0 0 0rem;
          margin-left: 3.5rem;
        }

        .sidebar:hover .logo-section {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0 0 0rem;
          margin-left: -1rem;
          transition: margin-left 0.5s ease;
        }

        .separator {
          height: 1.7px;
          margin: 1.5rem 0 3rem 0;
          background-image: linear-gradient(
            to right,
            transparent,
            rgba(233, 228, 226, 0.67),
            rgba(255, 255, 255, 0.99),
            rgba(223, 228, 223, 0.6),
            transparent
          );
        }

        .user-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          margin-bottom: 2rem;
          padding-right: 1rem; /* Add some padding on the right */
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0rem;
        }

        .user-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: width 0.3s ease, height 0.3s ease;
          overflow: hidden;
          background-color: rgb(218, 98, 50); /* Fallback color */
          margin-left: 0.4rem;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .sidebar:hover .user-img {
          width: 60px;
          height: 60px;
          transition: width 0.2s ease, height 0.2s ease;
        }

        .user-text {
          display: none;
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
        .sidebar:hover .user-text {
          display: block;
        }

        .username {
          font-size: 1.4rem; /* Reduced from 1.5rem */
          font-weight: 900;
          margin-left: 1.2rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .subtext {
          font-size: 1.1rem; /* Reduced from 1.1rem */
          color: #d1d5db;
          margin-left: 1.2rem;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .menu-header {
          font-size: 1.2rem;
          color: #d1d5db;
          text-transform: uppercase;
          margin-bottom: 2rem;
          white-space: nowrap;
          text-align: center;
        }

        .sidebar:hover .menu-header {
          font-size: 1.3rem;
          text-align: left;
          padding-left: 0.75rem;
          transition: font-size 0.2s ease, text-align 0.2s ease;
        }

        .nav-links {
          display: flex;
          flex-direction: column;
        }

        /* pratyush edit */
        .nav-item {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          gap: 1rem;
          font-size: 1.7rem;
          position: relative;
          padding: 0.5rem 0;
        }

        /* pratyush edit */
        .nav-icon-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px; /* Match your icon size */
        }
        .nav-item:hover {
          background-color: rgba(0, 0, 0, 0.16);
          border-radius: 50rem;
        }

        .nav-icon {
          font-size: 2.5rem;
          margin-left: 0.7rem;
        }

        .sidebar:hover .nav-text {
          display: inline;
          margin-left: 0.8rem;
          transition: margin-left 0.2s ease;
          transition: display 0.2s ease;
        }

        .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          background-color: white;
          width: 0;
        }

        .logout-separator {
          margin: auto 0 1rem 0;
        }

        .logout-button {
          color: white;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 1.7rem;
          position: relative;
          padding: 0.5rem 0;
        }

        .logout-button .nav-text {
          display: none;
        }

        .sidebar:hover .logout-button .nav-text {
          display: inline;
        }

        .tooltip-username {
          font-size: 1rem;
          font-weight: bold;
          margin: 0;
          color: white;
        }

        .tooltip-subtext {
          font-size: 0.8rem;
          margin: 0.3rem 0 0 0;
          color: #d1d5db;
        }
        .tooltip {
          background: rgba(0, 0, 0, 0.57);
          backdrop-filter: blur(5px);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          max-width: 300px;
          pointer-events: none;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .tooltip.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Sidebar;

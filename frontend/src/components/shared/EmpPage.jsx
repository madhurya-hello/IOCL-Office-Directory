import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import ExpandableCard from "./ExpandableCard"; // Component for expandable cards
import ExpandedCardView from "./ExpandedCardView"; // Component for expanded card view
import QrCodeIcon from "@mui/icons-material/QrCode"; // QR code icon
import Button from "@mui/material/Button"; // Material-UI button
import QrCode from "./QrCode"; // QR code generation component
import { Box } from "@mui/material"; // Material-UI layout component
import CircularProgress from "@mui/material/CircularProgress"; // Loading spinner

// Component to display employee profile page
const EmpPage = ({
  employee: initialEmployee,
  allowExpand = true,
  indianOilLogo,
  image,
}) => {
  // Retrieve current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('authState')); 
  const isAdmin = currentUser.isAdmin; 

  // State management
  const [employee, setEmployee] = useState(initialEmployee || {}); // Employee data
  const [loading, setLoading] = useState(!initialEmployee); // Loading state
  const [error, setError] = useState(null); // Error state
  const [expandedCard, setExpandedCard] = useState(null); // Index of expanded card
  const [showQR, setShowQR] = useState(false); // QR code visibility
  const [qrLoading, setQrLoading] = useState(false); // QR code loading state

  // Process employee data when initialEmployee changes
  useEffect(() => {
    if (!initialEmployee) return;

    const convertEmployeeData = () => {
      try {
        setLoading(true);
        // Split name into first and last parts
        const nameParts = initialEmployee.name?.trim().split(" ") || [];
        const firstName = nameParts[0] || "";
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

        // Transform employee data to match expected structure
        const convertedEmployee = {
          empNo: initialEmployee.empId || "",
          title: initialEmployee.title || "",
          firstName,
          lastName,
          gender: initialEmployee.gender || "",
          location: initialEmployee.location || "",
          function: initialEmployee.function || "",
          subgroupCode: initialEmployee.subgroupCode || "",
          subgroup: initialEmployee.subgroup || "",
          designation: initialEmployee.designation || "",
          birthDate: initialEmployee.dob || "",
          bloodGroup: initialEmployee.bloodGroup || "",
          parentDivision: initialEmployee.division || "",
          city: initialEmployee.city || "",
          workingHours: initialEmployee.workingHours || "",
          collarWorker: initialEmployee.workerType || "",
          workSchedule: initialEmployee.workSchedule || "",
          email: initialEmployee.email || "",
          phone: initialEmployee.phone || "",
          address: initialEmployee.address || "",
          password: "",
          status: initialEmployee.status || "",
          logged: false,
          lastLogged: "",
          admin: initialEmployee.admin || false,
        };

        setEmployee(convertedEmployee);
        setError(null);
      } catch (err) {
        setError("Failed to process employee data");
        console.error("Error processing employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    convertEmployeeData();
  }, [initialEmployee]);

  // Generate color based on employee name for avatar
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Inline styles for the component
  const styles = {
    container: {
      position: "relative",
      width: "100%",
      minHeight: "100vh",
      padding: "2rem",
      boxSizing: "border-box",
      background:
        "linear-gradient(125deg, rgb(187, 203, 255) 10%, rgb(223, 228, 248) 40%, rgb(248, 233, 225) 70%, rgb(236, 176, 143) 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.3rem",
      marginBottom: "2rem",
      width: "100%",
      maxWidth: "800px",
      textAlign: "center",
    },
    avatar: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      backgroundColor: stringToColor(
        `${employee.firstName || ""} ${employee.lastName || ""}`
      ),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "3rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    },
    name: {
      margin: "0rem 0",
      fontSize: "2.4rem",
      color: "rgb(4, 53, 145)",
      fontWeight: "600",
    },
    designation: {
      margin: "0rem 0",
      color: "rgb(4, 53, 145)",
      fontSize: "1.5rem",
      fontWeight: "300",
    },
    division: {
      margin: "0rem 0",
      color: "rgb(4, 53, 145)",
      fontSize: "1.2rem",
    },
    cardsWrapper: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      maxWidth: "67rem",
      position: "relative",
      height: "320px",
      marginTop: "2rem",
      gap: "1rem",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      zIndex: 999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    loading: {
      fontSize: "2.2rem",
      color: "rgb(4, 53, 145)",
    },
    error: {
      fontSize: "2.2rem",
      color: "red",
    },
    qrButton: {
      marginTop: "-3rem",
      marginBottom: "1rem",
      margin: "0.2rem 0",
      borderRadius: "12px",
      padding: "0.4rem 1.9rem",
      fontSize: "1rem",
      backgroundColor: "rgb(255, 255, 255)",
      color: "black",
      "&:hover": { backgroundColor: "#303f9f" },
    },
    qrOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: 1000,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    qrContent: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "2rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "20px",
      maxWidth: "90%",
    },
    qrCloseButton: {
      position: "absolute",
      top: "-1rem",
      right: "1rem",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "0.1rem",
      color: "#666",
      padding: "5px",
    },
  };

  // Define card content for display
  const cards = [
    {
      title: "Personal Details",
      content: [
        `Title: ${employee.title || ""}`,
        `Name: ${employee.title} ${employee.firstName} ${employee.lastName}`,
        `Gender: ${employee.gender || ""}`,
        `Blood Group: ${employee.bloodGroup || ""}`,
        `DOB: ${
          employee.birthDate
            ? isAdmin
              ? new Date(employee.birthDate).toLocaleDateString("en-GB")
              : new Date(employee.birthDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                })
            : ""
        }`,
        ...(isAdmin
          ? [
              `Status: ${employee.status || ""}`,
              `Admin: ${(employee.admin==true || employee.admin=="true") ? "true" : "false"}`,
            ]
          : []),
      ],
    },
    {
      title: "Work Information",
      content: [
        `Employee No: ${employee.empNo}`,
        `Designation: ${employee.designation}`,
        `Division: ${employee.parentDivision}`,
        `Function: ${employee.function}`,
        `Subgroup: ${employee.subgroup}`,
        ...(isAdmin
          ? [
              `Subgroup Code: ${employee.subgroupCode}`,
              `Worker Type: ${employee.collarWorker}`,
              `Working Hours: ${employee.workingHours}`,
              `Work Schedule: ${employee.workSchedule}`,
            ]
          : []),
      ],
    },
    {
      title: "Contact",
      content: [
        `Location: ${employee.location}`,
        `City: ${employee.city}`,
        `Phone: ${employee.phone}`,
        `Email: ${employee.email?.toLowerCase()}`,
        `Address: ${employee.address}`,
      ],
    },
  ];

  // Handle card expansion
  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Generate QR code
  const handleGenerateQR = () => {
    setQrLoading(true);
    setShowQR(true);
    setTimeout(() => setQrLoading(false), 3000); // Simulate QR generation delay
  };

  // Create vCard data for QR code
  const getQRData = () => {
    const phone = employee.phone
      ? employee.phone.toString().replace(/\D/g, "")
      : "";
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${employee.title || ""} ${employee.firstName} ${employee.lastName}`,
      `N:${employee.lastName};${employee.firstName};;${employee.title || ""};`,
      `ORG:IndianOil;${employee.parentDivision}`,
      `TITLE:${employee.designation || ""}`,
      `TEL;TYPE=WORK,VOICE:${phone}`,
      `EMAIL;TYPE=WORK:${employee.email}`,
      `ADR;TYPE=WORK:;;${employee.address?.replace(/,/g, "") || ""};${
        employee.city
      };;;`,
      `BDAY:${employee.birthDate || ""}`,
      `NOTE:Employee No: ${employee.empNo}\\nFunction: ${employee.function}\\nSubgroup: ${employee.subgroup}}`,
      "END:VCARD",
    ].join("\n");
    return vCard;
  };

  // Render loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading employee data...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* QR code overlay */}
      {showQR && (
        <motion.div
          style={styles.qrOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setShowQR(false)}
        >
          <motion.div
            style={styles.qrContent}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <button
              style={styles.qrCloseButton}
              onClick={() => setShowQR(false)}
            >
              X
            </button>
            {qrLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  width: "300px",
                }}
              >
                <CircularProgress size={60} thickness={3} />
              </div>
            ) : (
              <QrCode
                value={getQRData()}
                name={`${employee.firstName} ${employee.lastName}`}
                subtitle={employee.designation}
                tagline={employee.parentDivision}
                indianOilLogo={indianOilLogo}
                required
                image={image}
              />
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Header section with avatar and employee info */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={styles.header}
      >
        <div style={styles.avatar}>
          {employee.firstName?.charAt(0) || ""}
          {employee.lastName?.charAt(0) || ""}
        </div>
        <h1 style={styles.name}>
          {employee.title} {employee.firstName} {employee.lastName}
        </h1>
        <h2 style={styles.designation}>{employee.designation}</h2>
        <p style={styles.division}>{employee.parentDivision}</p>
      </motion.div>

      {/* QR code generation button */}
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Button
          component={motion.button}
          variant="contained"
          startIcon={<QrCodeIcon />}
          style={styles.qrButton}
          onClick={handleGenerateQR}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          Generate QR
        </Button>
      </Box>

      {/* Cards section */}
      <motion.div
        style={styles.cardsWrapper}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
      >
        {/* Overlay for expanded card */}
        {expandedCard !== null && (
          <div style={styles.overlay} onClick={() => setExpandedCard(null)} />
        )}
        {/* Render expandable cards */}
        {cards.map((card, index) => (
          <ExpandableCard
            key={index}
            title={card.title}
            content={card.content}
            isExpanded={expandedCard === index}
            onClick={() => allowExpand && handleCardClick(index)}
            index={index}
            employee={employee}
            allowExpand={allowExpand}
            setEmployee={setEmployee}
            isAdmin={isAdmin}
          />
        ))}
        {/* Render expanded card view */}
        <AnimatePresence>
          {expandedCard !== null && (
            <ExpandedCardView
              card={cards[expandedCard]}
              employee={employee}
              onClose={() => setExpandedCard(null)}
              index={initialEmployee.id}
              setEmployee={setEmployee}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EmpPage;

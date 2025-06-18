import React, { useState, useEffect } from "react";
import axios from "axios"; // HTTP client for API requests
import { FiX, FiClock, FiCheck, FiAlertTriangle } from "react-icons/fi"; // Icons for UI
import { motion } from "framer-motion"; // Animation library
import styled from "styled-components"; // Styled-components for CSS-in-JS
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Dropdown icon
import { Snackbar } from "@mui/material"; // Snackbar for notifications
import MuiAlert from "@mui/material/Alert"; // Alert component for Snackbar
import { CircularProgress } from "@mui/material"; // Loading spinner
import { toast, ToastContainer } from "react-toastify"; // Notification library
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import { useDispatch } from "react-redux";

// Styled modal backdrop
const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
`;

// Styled modal container
const ModalContainer = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 75vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  margin: auto;
  margin-top: 4rem; /* Add gap from the top */
`;

// Styled section header
const SectionHeader = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

// Styled submit button
const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: none;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  font-size: 1rem;
`;

// Styled snackbar for top notifications
const TopSnackbar = styled(Snackbar)`
  && {
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: auto;
    max-width: 80%;
  }

  & .MuiAlert-root {
    font-size: 1rem;
    padding: 12px 20px;
    min-width: 300px;
  }
`;

// Input field component with support for text and textarea
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  error = null,
  disabled = false,
}) => (
  <motion.div whileHover={{ scale: 1.01 }} style={{ marginBottom: "1.5rem" }}>
    <label
      style={{
        display: "block",
        marginBottom: "0.5rem",
        fontSize: "0.95rem",
        color: "#4b5563",
        fontWeight: "500",
      }}
    >
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>

    {type === "textarea" ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          height: "6rem",
          padding: "0.75rem",
          borderRadius: "8px",
          border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
          backgroundColor: disabled ? "#e5e7eb" : "#f9fafb",
          fontSize: "0.95rem",
          resize: "none",
          transition: "all 0.2s ease",
        }}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
          backgroundColor: disabled ? "#e5e7eb" : "#f9fafb",
          fontSize: "0.95rem",
          transition: "all 0.2s ease",
        }}
      />
    )}
    {error && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          color: "#ef4444",
          fontSize: "0.8rem",
          marginTop: "0.25rem",
        }}
      >
        {error}
      </motion.p>
    )}
  </motion.div>
);

// Input field with dropdown for selecting predefined options
const InputFieldWithDropdown = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
  disabled = false,
}) => {
  const handleSelectChange = (e) => {
    if (disabled) return;
    const syntheticEvent = {
      target: {
        name: name,
        value: e.target.value,
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} style={{ marginBottom: "1.5rem" }}>
      <label
        style={{
          display: "block",
          marginBottom: "0.5rem",
          fontSize: "0.95rem",
          color: "#4b5563",
          fontWeight: "500",
        }}
      >
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "8px",
            border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
            backgroundColor: disabled ? "#e5e7eb" : "#f9fafb",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
            paddingRight: "2.5rem",
            appearance: "none",
          }}
          list={`${name}-options`}
        />

        <select
          name={`${name}-select`}
          value={value}
          onChange={handleSelectChange}
          disabled={disabled}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "8rem",
            height: "100%",
            opacity: 0,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <datalist id={`${name}-options`}>
          {options.map((opt) => (
            <option key={opt} value={opt} />
          ))}
        </datalist>

        <ArrowDropDownIcon
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            opacity: disabled ? 0.5 : 1,
            fontSize: "1.2rem",
            color: "#4b5563",
          }}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            color: "#ef4444",
            fontSize: "0.8rem",
            marginTop: "0.25rem",
          }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};
// Main component for editing employee profile
const EditProfile = ({ onClose, onSubmit }) => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem("authState"));
  const isAdmin = currentUser.isAdmin;

  // Initial and current form data states
  const [initialFormData, setInitialFormData] = useState({
    empNo: "",
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    location: "",
    function: "",
    subgroupCode: "",
    subgroup: "",
    designation: "",
    dob: "",
    bloodGroup: "",
    parentDivision: "",
    city: "",
    workingHours: "",
    collarWorker: "",
    workSchedule: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: "",
    password: "",
    status: "",
  });

  const [formData, setFormData] = useState({
    empNo: "",
    title: "",
    firstName: "",
    lastName: "",
    gender: "",
    location: "",
    function: "",
    subgroupCode: "",
    subgroup: "",
    designation: "",
    dob: "",
    bloodGroup: "",
    parentDivision: "",
    city: "",
    workingHours: "",
    collarWorker: "",
    workSchedule: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: "",
    password: "",
    status: "",
  });

  // State for form errors, submission, and UI control
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(true);

  const [requestStatus, setRequestStatus] = useState("pending");
  const [rejectionMessage, setRejectionMessage] = useState(
    "your request was rejected"
  );

  const [requestMessage, setRequestMessage] = useState("");

  // Check for form changes
  useEffect(() => {
    const hasFormChanged = Object.keys(initialFormData).some(
      (key) => formData[key] !== initialFormData[key]
    );
    setHasChanges(hasFormChanged);
  }, [formData, initialFormData]);

  // Fetch employee data and request status on mount
  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/employees/myRequestStatus?emp_id=${currentUser.id}`
        );
        setRequestStatus(response.data.r_status);
        setRejectionMessage(response.data.r_message);

        if (
          response.data.r_status === "accepted" ||
          response.data.r_status === "rejected"
        ) {
          try {
            await axios.delete(
              `http://localhost:8080/api/employees/deleteMyRequestStatus?empId=${currentUser.id}`
            );
          } catch (deleteError) {
            console.error("Error clearing request status:", deleteError);
          }
        }

        try {
          const response = await axios.get(
            `http://localhost:8080/api/employees/getSpecificData?id=${currentUser.id}`
          );
          const transformedData = {
            empNo: response.data.empNo.toString(),
            title: response.data.title,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            gender: response.data.gender,
            location: response.data.location,
            function: response.data.function,
            subgroupCode: response.data.subgroupCode,
            subgroup: response.data.subgroup,
            designation: response.data.designation,
            dob: response.data.birthDate,
            bloodGroup: response.data.bloodGroup,
            parentDivision: response.data.parentDivision,
            city: response.data.city,
            workingHours: response.data.workingHours.toString(),
            collarWorker: response.data.collarWorker,
            workSchedule: response.data.workSchedule,
            email: response.data.email,
            phone: response.data.phone,
            address: response.data.address,
            isAdmin: response.data.admin ? "true" : "false",
            password: response.data.password,
            status: response.data.status,
          };
          setFormData(transformedData);
          setInitialFormData(transformedData);
          currentUser.name = `${transformedData.firstName} ${transformedData.lastName}`;
          currentUser.email = `${transformedData.email}`;
          localStorage.setItem("authState", JSON.stringify(currentUser));
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      } catch (error) {
        console.error("Error fetching request status:", error);
        setRequestStatus("none");
        setRejectionMessage("");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequestStatus();
  }, [currentUser.id]);

  // Determine if a field should be disabled
  const isFieldDisabled = (fieldName) => {
    if (isAdmin) return false;
    if (requestStatus == "pending") return true;
    if (fieldName === "empNo") return true;
    return false;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.designation)
      newErrors.designation = "Designation is required";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    // Phone validation
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        empNo: parseInt(formData.empNo),
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        location: formData.location,
        function: formData.function,
        subgroupCode: formData.subgroupCode,
        subgroup: formData.subgroup,
        designation: formData.designation,
        birthDate: formData.dob,
        bloodGroup: formData.bloodGroup,
        parentDivision: formData.parentDivision,
        city: formData.city,
        workingHours: parseFloat(formData.workingHours) || 0,
        collarWorker: formData.collarWorker,
        workSchedule: formData.workSchedule,
        email: formData.email,
        phone: formData.phone ? parseInt(formData.phone) : 0,
        address: formData.address,
        isAdmin: formData.isAdmin === "true",
        password: formData.password,
        status: formData.status,
      };

      const currentUser = JSON.parse(localStorage.getItem("authState"));
      const id = currentUser.id;
      // Make the API call to update the employee
      const response = await axios.put(
        `http://localhost:8080/api/employees/updateEmployee?id=${id}`,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Dispatch action to update the employee in Redux store
      dispatch({
        type: "employee/updateEmployee",
        payload: {
          id: id,
          updatedEmployee: response.data,
        },
      });
      // Update local storage with new name and email
      const updatedUser = {
        ...currentUser,
        name: `${response.data.name}`,
        email: response.data.email,
      };
      localStorage.setItem("authState", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (requestStatus === "pending") {
      toast.error("You already have a pending request.");
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        empNo: parseInt(formData.empNo),
        title: formData.title,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        location: formData.location,
        function: formData.function,
        subgroupCode: formData.subgroupCode,
        subgroup: formData.subgroup,
        designation: formData.designation,
        birthDate: formData.dob,
        bloodGroup: formData.bloodGroup,
        parentDivision: formData.parentDivision,
        city: formData.city,
        workingHours: parseFloat(formData.workingHours) || 0,
        collarWorker: formData.collarWorker,
        workSchedule: formData.workSchedule,
        email: formData.email,
        phone: formData.phone ? parseInt(formData.phone) : 0,
        address: formData.address,
        isAdmin: formData.isAdmin === "true",
        password: formData.password,
        status: formData.status,
        message: requestMessage,
      };

      await axios.post(
        `http://localhost:8080/api/employees/requestUpdate?id=${currentUser.id}`,
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await axios.post(
        `http://localhost:8080/api/employees/setRequestStatus`,
        {
          emp_id: currentUser.id,
          r_status: "pending",
          r_message: "",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setRequestStatus("pending");
      setRejectionMessage("");

      toast.success("Request sent successfully!");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render request status for non-admins
  const renderRequestStatus = () => {
    if (isAdmin) return null;

    let statusElement = null;
    switch (requestStatus) {
      case "pending":
        statusElement = (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#d97706",
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              fontWeight: 550,
            }}
          >
            <FiClock style={{ fontSize: "1.7rem" }} />
            <span>Request Pending</span>
          </motion.div>
        );
        break;
      case "accepted":
        statusElement = (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#059669",
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.2rem",
              fontWeight: 550,
            }}
          >
            <FiCheck style={{ fontSize: "1.7rem" }} />
            <span>Request Accepted</span>
          </motion.div>
        );
        break;
      case "rejected":
        statusElement = (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#dc2626",
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1rem",
              fontWeight: 550,
            }}
          >
            <FiAlertTriangle style={{ fontSize: "1.7rem" }} />
            <div>
              <div>Request Rejected</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                {rejectionMessage || ""}
              </div>
            </div>
          </motion.div>
        );
        break;
      default:
        return null;
    }

    return statusElement;
  };

  return (
    <div>
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
      {/* Modal backdrop */}
      <ModalBackdrop onClick={onClose}>
        <ModalContainer
          initial={{ scale: 0.97, y: 18 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          onClick={(e) => e.stopPropagation()}
          style={isLoading ? { height: "90vh" } : {}}
        >
          {isLoading ? (
            <>
              {/* Header during loading */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "2rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#1e40af",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  Employee Profile
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#6b7280",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <FiX />
                </motion.button>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                <CircularProgress size={50} />
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  marginBottom: "2rem",
                }}
              >
                {renderRequestStatus()}
                <h2
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "700",
                    color: "#1e40af",
                    textAlign: "center",
                    flex: 1,
                  }}
                >
                  Employee Profile
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: "#6b7280",
                    position: "absolute",
                    right: 0,
                  }}
                >
                  <FiX />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <SectionHeader>Personal Information</SectionHeader>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <InputField
                    label="Employee Number"
                    name="empNo"
                    value={formData.empNo}
                    onChange={handleChange}
                    type="text"
                    required
                    disabled={isFieldDisabled("empNo")} // Always disabled for everyone
                  />

                  <InputFieldWithDropdown
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    options={["Mr", "Ms"]}
                    required
                    disabled={isFieldDisabled("title")} // Always editable
                  />

                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    error={errors.firstName}
                    disabled={isFieldDisabled("firstName")} // Always editable
                  />

                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    error={errors.lastName}
                    disabled={isFieldDisabled("lastName")} // Always editable
                  />

                  <InputFieldWithDropdown
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={["Male", "Female", "Non-binary"]}
                    required
                    disabled={isFieldDisabled("gender")} // Always editable
                  />

                  <InputField
                    label="Date of Birth"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    type="date"
                    required
                    error={errors.dob}
                    disabled={isFieldDisabled("dob")} // Only editable by admin
                  />

                  <InputFieldWithDropdown
                    label="Blood Group"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    options={[
                      "",
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "O+",
                      "O-",
                      "AB+",
                      "AB-",
                    ]}
                    disabled={isFieldDisabled("bloodGroup")} // Only editable by admin
                  />
                </div>

                {/* Contact Information Section */}
                <SectionHeader>Contact Information</SectionHeader>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    error={errors.email}
                    disabled={isFieldDisabled("email")} // Always editable
                  />

                  <InputField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    required
                    error={errors.phone}
                    disabled={isFieldDisabled("phone")} // Always editable
                  />

                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isFieldDisabled("address")} // Always editable
                  />
                </div>

                {/* Job Information Section */}
                <SectionHeader>Job Information</SectionHeader>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2rem",
                  }}
                >
                  <InputFieldWithDropdown
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    options={[
                      "Agartala AFS",
                      "Agartala BP",
                      "Aizawl AFS",
                      "Along AFS",
                      "Barapani AFS",
                      "Barapani BP Project",
                      "Bongaigaon BP",
                      "Bongaigaon Installation",
                      "Chabua AFS",
                      "Dharmanagar Dep",
                      "Dibrugarh AFS",
                      "Digboi Terminal",
                      "Dimapur AFS",
                      "Dimapur BP",
                      "Dimapur Depot",
                      "Doimukh Depot",
                      "Doom Dooma AFS",
                      "Gopanari BP",
                      "Guwahati AFS",
                      "Guwahati DO",
                      "Guwahati Indane DO",
                      "Guwahati TOP",
                      "Guwahati Terminal",
                      "Imphal AFS",
                      "Imphal DO",
                      "Indian Oil AOD SO",
                      "Jorhat AFS",
                      "Kimin BP",
                      "Kumbhirgram  AFS",
                      "Lilabari AFS",
                      "Lumding Terminal",
                      "Malom Depot",
                      "Missamari Dep",
                      "Moinarband Depot",
                      "Mualkhang BP",
                      "Naharlagun AFS",
                      "North Guwahati BP",
                      "Passighat AFS",
                      "Sarpara BP",
                      "Sekerkote Depot Project",
                      "Sekmai BP",
                      "Silchar BP",
                      "Silchar DO",
                      "Silchar Indane DO",
                      "Tezpur AFS",
                      "Tinsukia DO",
                      "Tinsukia Indane DO",
                      "Vairangte Depot",
                      "Ziro AFS",
                    ]}
                    required
                    disabled={isFieldDisabled("location")}
                  />

                  <InputFieldWithDropdown
                    label="Function"
                    name="function"
                    value={formData.function}
                    onChange={handleChange}
                    options={[
                      "Aviation",
                      "Coordination",
                      "ED/CGM/GM Sectt",
                      "Engineering",
                      "Finance",
                      "Human Resource",
                      "Info. Systems",
                      "Inst. Bus.",
                      "Law",
                      "LPG",
                      "Lubes",
                      "Operations",
                      "QRC",
                      "Retail Sales",
                      "Vigilance",
                    ]}
                    required
                    disabled={isFieldDisabled("function")}
                  />

                  <InputField
                    label="Designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required
                    error={errors.designation}
                    disabled={isFieldDisabled("designation")}
                  />

                  <InputFieldWithDropdown
                    label="Subgroup"
                    name="subgroup"
                    value={formData.subgroup}
                    onChange={handleChange}
                    options={[
                      "IOC Non Ofcr Gr 1",
                      "IOC Non Ofcr Gr 2",
                      "IOC Non Ofcr Gr 3",
                      "IOC Non Ofcr Gr 4",
                      "IOC Non Ofcr Gr 5",
                      "IOC Non Ofcr Gr 6",
                      "IOC Non Ofcr Gr 7",
                      "IOC Non Ofcr Gr 8",
                      "IOC Non Ofcr Gr 9",
                      "IOC NonOfcr Gr3(SG1)",
                      "IOC NonOfcr Gr3(SG2)",
                      "IOC Ofcr Gr A",
                      "IOC Ofcr Gr A0",
                      "IOC Ofcr Gr A1",
                      "IOC Ofcr Gr B",
                      "IOC Ofcr Gr C",
                      "IOC Ofcr Gr D",
                      "IOC Ofcr Gr E",
                      "IOC Ofcr Gr F",
                      "IOC Ofcr Gr G",
                      "IOC Ofcr Gr H",
                      "IOC Ofcr Gr I",
                    ]}
                    required
                    disabled={isFieldDisabled("subgroup")}
                  />

                  <InputFieldWithDropdown
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    options={[
                      "Agartala",
                      "Aizwal",
                      "Along",
                      "Barapani, Shillong",
                      "Barpeta",
                      "Bongaigaon",
                      "Chabua",
                      "Dharmanagar",
                      "Dibrugarh",
                      "Digboi",
                      "Dimapur",
                      "Doimukh",
                      "Doom Dooma",
                      "Gopanari, Digboi",
                      "Guwahati",
                      "Imphal",
                      "Jorhat",
                      "Kimin",
                      "Kohima",
                      "Kumbhigram",
                      "Lumding",
                      "Missamari",
                      "Mualkhang",
                      "Nagaon",
                      "Naharlagun",
                      "Nalbari",
                      "North Guwahati",
                      "North Lakhimpur",
                      "Passighat",
                      "Sarpara",
                      "Sekmai",
                      "Shillong",
                      "Sibsagar",
                      "Silchar",
                      "Tezpur",
                      "Tinsukia",
                      "Tura",
                      "Vairangte",
                      "Ziro",
                    ]}
                    required
                    disabled={isFieldDisabled("city")}
                  />

                  {/* Only show these fields for admin */}
                  {isAdmin && (
                    <>
                      <InputField
                        label="Subgroup Code"
                        name="subgroupCode"
                        value={formData.subgroupCode}
                        onChange={handleChange}
                        required
                        disabled={isFieldDisabled("subgroupCode")}
                      />

                      <InputFieldWithDropdown
                        label="Parent Division"
                        name="parentDivision"
                        value={formData.parentDivision}
                        onChange={handleChange}
                        options={["Marketting", "AOD", "IBP", "BRPL"]}
                        required
                        disabled={isFieldDisabled("parentDivision")}
                      />

                      <InputField
                        label="Working Hours"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        type="number"
                        disabled={isFieldDisabled("workingHours")}
                      />

                      <InputFieldWithDropdown
                        label="Collar Worker"
                        name="collarWorker"
                        value={formData.collarWorker}
                        onChange={handleChange}
                        options={["", "White Collar", "Blue Collar"]}
                        disabled={isFieldDisabled("collarWorker")}
                      />

                      <InputField
                        label="Work Schedule"
                        name="workSchedule"
                        value={formData.workSchedule}
                        onChange={handleChange}
                        disabled={isFieldDisabled("workSchedule")}
                      />

                      <InputFieldWithDropdown
                        label="Status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        options={["active", "retired", "transfered"]}
                        required
                        disabled={isFieldDisabled("status")}
                      />

                      <InputFieldWithDropdown
                        label="Is Admin?"
                        name="isAdmin"
                        value={isAdmin}
                        onChange={handleChange}
                        options={["false", "true"]}
                        disabled={isFieldDisabled("isAdmin")}
                      />
                    </>
                  )}
                </div>

                {isAdmin ? (
                  <SubmitButton
                    type="submit"
                    whileHover={
                      isSubmitting || !hasChanges
                        ? {}
                        : { scale: 1.02, backgroundColor: "#2563eb" }
                    }
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || !hasChanges}
                    style={{
                      backgroundColor: !hasChanges ? "#9ca3af" : "#3b82f6",
                      cursor: !hasChanges ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting ? "Updating..." : "Update Profile"}
                  </SubmitButton>
                ) : (
                  <>
                    <InputField
                      label="Request Message (Optional)"
                      name="requestMessage"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      type="textarea"
                      disabled={isSubmitting}
                    />
                    <SubmitButton
                      type="button"
                      onClick={handleUpdateRequest}
                      whileHover={
                        isSubmitting ||
                        !hasChanges ||
                        requestStatus === "pending"
                          ? {}
                          : { scale: 1.02, backgroundColor: "#2563eb" }
                      }
                      whileTap={{ scale: 0.98 }}
                      disabled={
                        isSubmitting ||
                        !hasChanges ||
                        requestStatus === "pending"
                      }
                      style={{
                        backgroundColor:
                          !hasChanges || requestStatus === "pending"
                            ? "#9ca3af"
                            : "#3b82f6",
                        cursor:
                          !hasChanges || requestStatus === "pending"
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isSubmitting ? "Requesting..." : "Request Update"}
                    </SubmitButton>
                  </>
                )}
              </form>
            </>
          )}
        </ModalContainer>
      </ModalBackdrop>
    </div>
  );
};

export default EditProfile;

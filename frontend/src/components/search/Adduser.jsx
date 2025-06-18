import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addEmployee } from "../../store/employeeSlice";

// Styled Components
// Modal backdrop with blur effect
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
// Main modal container with scrollable content
const ModalContainer = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 1500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 1002;
  margin: auto;
  margin-top: 4rem;
`;
// Section headers with blue accent
const SectionHeader = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

// Primary submit button with hover effects

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

// Reusable Input Component
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = [],
  required = false,
  error = null,
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

    {type === "select" ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
          fontSize: "0.95rem",
          transition: "all 0.2s ease",
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: error ? "1px solid #ef4444" : "1px solid #e5e7eb",
          backgroundColor: "#f9fafb",
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

const AddUser = ({ onClose, onSubmit }) => {
  const dispatch = useDispatch();
  // Form data state with default values
  const [formData, setFormData] = useState({
    gender: "Male",
    title: "Mr",
    firstName: "",
    lastName: "",
    dob: "",
    bloodGroup: "",
    email: "",
    phone: "",
    address: "",
    empNo: "",
    location: "",
    function: "Aviation",
    customFunction: "",
    subGroupCode: "",
    subGroup: "IOC Ofcr Gr A",
    customSubGroup: "",
    designation: "",
    parentDivision: "Marketting",
    customParentDivision: "",
    city: "Guwahati",
    customCity: "",
    workingHours: "",
    collarWorker: "",
    workSchedule: "",
    isAdmin: "false",
    password: "",
    status: "active",
  });
  // Form validation errors
  const [errors, setErrors] = useState({});
  // Loading state during submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    // Required field validation (only keeping firstName, lastName, and empNo as required)
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.empNo) newErrors.empNo = "Employee number is required";

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation for admins
    if (formData.isAdmin === "true" && !formData.password) {
      newErrors.password = "Password is required for admin users";
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
        location: formData.location || "",
        function:
          formData.function === "Custom"
            ? formData.customFunction
            : formData.function,
        subgroupCode: formData.subGroupCode || "",
        subgroup:
          formData.subGroup === "Custom"
            ? formData.customSubGroup
            : formData.subGroup,
        designation: formData.designation || "",
        birthDate: formData.dob || "",
        bloodGroup: formData.bloodGroup || "",
        parentDivision:
          formData.parentDivision === "Custom"
            ? formData.customParentDivision
            : formData.parentDivision,
        city: formData.city === "Custom" ? formData.customCity : formData.city,
        workingHours: parseFloat(formData.workingHours) || 0,
        collarWorker: formData.collarWorker || "",
        workSchedule: formData.workSchedule || "",
        email: formData.email || "",
        phone: formData.phone ? parseInt(formData.phone) : 0,
        address: formData.address || "",
        isAdmin: formData.isAdmin === "true",
        status: formData.status,
      };

      const resultAction = await dispatch(addEmployee(employeeData)).unwrap();
      toast.success("Employee added successfully!");
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer
        initial={{ scale: 0.99, y: 9 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
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
            Add New Employee
          </h2>
          <motion.button
            whileHover={{
              scale: 1.12,
              backgroundColor: "rgb(248, 168, 168)",
              color: "rgb(0,0,0)",
            }}
            whileFocus={{
              scale: 1.1,
              backgroundColor: "rgb(185, 183, 183)",
              color: "white",
            }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.5rem",
              color: "rgb(0,0,0)",
              backgroundColor: "rgba(202, 201, 201, 0.36)",
              position: "absolute",
              right: 0,
              padding: "0.6rem",
              borderRadius: "50%",
              transition: "all 0.1s",
            }}
            transition={{
              backgroundColor: { duration: 0.1 },
            }}
          >
            <FiX />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* // Personal Information Section */}
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
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              type="select"
              options={["Male", "Female", "Non-binary"]}
              required
            />

            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="select"
              options={["Mr", "Ms"]}
              required
            />

            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              error={errors.firstName}
            />

            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              error={errors.lastName}
            />

            <InputField
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
            />

            <InputField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              type="select"
              options={["", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
            />
          </div>

          {/* // Contact Information Section   */}
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
            />

            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
            />

            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* // Job Information Section */}
          <SectionHeader>Job Information</SectionHeader>

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
              type="number"
              required
              error={errors.empNo}
            />

            <InputField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              type="select"
              options={["active", "retired", "transfered"]}
              required
            />

            <InputField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              type="select"
              options={[
                "Custom",
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
            />

            {formData.city === "Custom" && (
              <InputField
                label="Custom City"
                name="customCity"
                value={formData.customCity}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Function"
              name="function"
              value={formData.function}
              onChange={handleChange}
              type="select"
              options={[
                "Custom",
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
            />

            {formData.function === "Custom" && (
              <InputField
                label="Custom Function"
                name="customFunction"
                value={formData.customFunction}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Parent Division"
              name="parentDivision"
              value={formData.parentDivision}
              onChange={handleChange}
              type="select"
              options={["Custom", "Marketting", "AOD", "IBP", "BRPL"]}
            />

            {formData.parentDivision === "Custom" && (
              <InputField
                label="Custom Parent Division"
                name="customParentDivision"
                value={formData.customParentDivision}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Subgroup Code"
              name="subGroupCode"
              value={formData.subGroupCode}
              onChange={handleChange}
            />

            <InputField
              label="Subgroup"
              name="subGroup"
              value={formData.subGroup}
              onChange={handleChange}
              type="select"
              options={[
                "Custom",
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
            />

            {formData.subGroup === "Custom" && (
              <InputField
                label="Custom Subgroup"
                name="customSubGroup"
                value={formData.customSubGroup}
                onChange={handleChange}
              />
            )}

            <InputField
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />

            <InputField
              label="Working Hours"
              name="workingHours"
              value={formData.workingHours}
              onChange={handleChange}
              type="number"
            />

            <InputField
              label="Collar Worker"
              name="collarWorker"
              value={formData.collarWorker}
              onChange={handleChange}
              type="select"
              options={["", "White Collar", "Blue Collar"]}
            />

            <InputField
              label="Work Schedule"
              name="workSchedule"
              value={formData.workSchedule}
              onChange={handleChange}
            />

            <InputField
              label="Is Admin?"
              name="isAdmin"
              value={formData.isAdmin}
              onChange={handleChange}
              type="select"
              options={["false", "true"]}
            />
          </div>

          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.02, backgroundColor: "#2563eb" }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Employee"}
          </SubmitButton>
        </form>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default AddUser;

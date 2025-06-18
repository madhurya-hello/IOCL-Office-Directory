import { useState } from "react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import styled from "styled-components";
import { addNewIntercomData } from "../../store/employeeSlice";
import { useDispatch } from "react-redux";

// Main modal container with animation
const ModalContainer = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;
// Section headers with motion effects
const SectionHeader = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
`;

// Animated submit button
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

// Reusable input field component
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

// Redux and state management
const AddUser = ({
  onClose,
  onSubmit,
  gradeOptions = [],
  floorOptions = [],
}) => {
  const dispatch = useDispatch();
  // Form state
  const [formData, setFormData] = useState({
    empNo: "",
    intercomNo: "",
    grade: "",
    floor: "",
  });

  const [errors, setErrors] = useState({}); // Validation errors
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const [showCustomGrade, setShowCustomGrade] = useState(false); // Toggle for custom grade input
  const [showCustomFloor, setShowCustomFloor] = useState(false); // Toggle for custom floor input

  // Form change handler with special logic for custom fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handles both regular inputs and custom field toggles
    // Special cases for grade and floor dropdowns

    if (name === "grade" && e.target.tagName === "SELECT") {
      if (value === "custom") {
        setShowCustomGrade(true);
        setFormData((prev) => ({ ...prev, grade: "" }));
      } else {
        setShowCustomGrade(false);
        setFormData((prev) => ({ ...prev, grade: value }));
      }
      return;
    }

    if (name === "floor" && e.target.tagName === "SELECT") {
      if (value === "custom") {
        setShowCustomFloor(true);
        setFormData((prev) => ({ ...prev, floor: "" }));
      } else {
        setShowCustomFloor(false);
        setFormData((prev) => ({ ...prev, floor: value }));
      }
      return;
    }

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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.empNo) newErrors.empNo = "Employee number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const employeeData = {
        empNo: formData.empNo,
        intercom: formData.intercomNo,
        grade: formData.grade,
        floor: formData.floor,
      };

      await dispatch(addNewIntercomData(employeeData)).unwrap();

      toast.success("Employee added successfully!");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error creating employee:", error);
      toast.error("Failed to add employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContainer
      //Modal header with close button
      initial={{ scale: 1, y: 15 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
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
          Add New Employee (Quick Add)
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
        {/* Basic Information section */}
        <SectionHeader>Basic Information</SectionHeader>

        {/* Grid layout for form fields */}
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
            error={errors.empNo}
          />

          <InputField
            label="Intercom Number"
            name="intercomNo"
            value={formData.intercomNo}
            onChange={handleChange}
            type="text"
          />

          <InputField
            label="Grade"
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            type="select"
            options={["", "custom", ...gradeOptions]}
          />

          {showCustomGrade && (
            <InputField
              label="Custom Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              type="text"
            />
          )}

          <InputField
            label="Floor"
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            type="select"
            options={["", "custom", ...floorOptions]}
          />

          {showCustomFloor && (
            <InputField
              label="Custom Floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              type="text"
            />
          )}
        </div>

        {/* Submit button with loading state */}
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
  );
};

export default AddUser;

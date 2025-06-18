import React, { useState } from "react";
import { Box, Typography, Divider, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import BadgeIcon from "@mui/icons-material/Badge";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import BuildIcon from "@mui/icons-material/Build";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PublicIcon from "@mui/icons-material/Public";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { useDispatch } from "react-redux";
import { updateIntercomData } from "../../store/employeeSlice";

// Employee detail view component with edit functionality
const LeftCard = ({ employee, onClose }) => {
  // State for edit mode and form data
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [initialEmployee, setInitialEmployee] = useState({ ...employee });
  const [editedEmployee, setEditedEmployee] = useState({ ...employee });
  const currentUser = JSON.parse(localStorage.getItem("authState"));
  const isAdmin = currentUser.isAdmin;
  if (!employee) return null;

  // Handle save/edit toggle
  const handleEditClick = async () => {
    if (isEditing) {
      try {
        // Dispatch update to Redux
        const employeeData = {
          empNo: editedEmployee.empNo,
          name: editedEmployee.name,
          email: editedEmployee.email,
          designation: editedEmployee.designation,
          workerType: editedEmployee.workerType,
          phone: editedEmployee.phone,
          grade: editedEmployee.grade,
          floor: editedEmployee.floor,
          location: editedEmployee.location,
          intercom: editedEmployee.intercom,
          division: editedEmployee.division,
          function: editedEmployee.function,
          status: editedEmployee.status,
        };

        await dispatch(
          updateIntercomData({
            id: editedEmployee.id,
            employeeData,
          })
        ).unwrap();

        setInitialEmployee({ ...editedEmployee });
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      setIsEditing(true);
    }
  };
  // Form field change handler
  const handleFieldChange = (field, value) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Box
      sx={{
        /* card container styles */
        height: "100%",
        padding: "24px",
        overflow: "auto",
        background:
          "linear-gradient(135deg, rgba(231, 244, 250, 0.9) 0%, rgba(255, 255, 255, 1) 100%)",
        position: "relative",
      }}
    >
      {/* Action buttons (edit/close) */}
      <Box
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 1,
          display: "flex",
          gap: 1,
        }}
      >
        {isAdmin && (
          <IconButton
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              "&:hover": {
                backgroundColor: "rgb(194, 250, 197)",
                transform: "scale(1.1)",
              },
              transition: "all 0.2s ease",
            }}
            onClick={handleEditClick}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        )}

        <IconButton
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "rgb(252, 199, 199)",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease",
          }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main content sections */}
      <Box sx={{ mt: 6 }}>
        {/* Name and Designation section */}
        <Box
          sx={{
            mb: 4,
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          {isEditing ? (
            // Editable fields
            <>
              <TextField
                fullWidth
                variant="outlined"
                value={editedEmployee.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                sx={{ mb: 2 }}
                placeholder="Enter Full Name (Optional)"
              />
              <TextField
                fullWidth
                variant="outlined"
                value={editedEmployee.designation || ""}
                onChange={(e) =>
                  handleFieldChange("designation", e.target.value)
                }
                placeholder="Enter Designation (Optional)"
              />
            </>
          ) : (
            // Display only
            <>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  color: "#2c3e50",
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {initialEmployee.name || ""}
                <Box
                  component="span"
                  sx={{
                    backgroundColor:
                      initialEmployee.status?.toLowerCase() === "active"
                        ? "#4CAF50"
                        : "#F44336",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: "600",
                    padding: "2px 10px",
                    borderRadius: "10px",
                    ml: 1,
                    alignSelf: "center",
                  }}
                >
                  {initialEmployee.status || ""}
                </Box>
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#546e7a",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                }}
              >
                {initialEmployee.designation || ""}
              </Typography>
            </>
          )}
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: "1px",
          }}
        />

        {/* Contact Information section */}
        <Box
          sx={{
            mb: 4,
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              color: "#2c3e50",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <PhoneIcon fontSize="medium" />
            Contact Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            <DetailItem
              label="Email"
              value={
                isEditing
                  ? editedEmployee.email || ""
                  : initialEmployee.email?.toLowerCase() || ""
              }
              icon={<EmailIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("email", value)}
            />
            <DetailItem
              label="Phone"
              value={
                isEditing
                  ? editedEmployee.phone || ""
                  : initialEmployee.phone || ""
              }
              icon={<PhoneIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("phone", value)}
            />
            <DetailItem
              label="Intercom"
              value={
                isEditing
                  ? editedEmployee.intercom || ""
                  : initialEmployee.intercom || ""
              }
              icon={<BusinessIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("intercom", value)}
            />
            <DetailItem
              label="Worker Type"
              value={
                isEditing
                  ? editedEmployee.workerType || ""
                  : initialEmployee.workerType || ""
              }
              icon={<WorkOutlineIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("workerType", value)}
            />
          </Box>
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: "1px",
          }}
        />

        {/* Other contact fields... */}
        <Box
          sx={{
            mb: 4,
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              color: "#2c3e50",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WorkIcon fontSize="medium" />
            Professional Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            <DetailItem
              label="Employee No"
              value={initialEmployee.empNo}
              icon={<BadgeIcon />}
              isEditing={false}
            />
            <DetailItem
              label="Division"
              value={
                isEditing
                  ? editedEmployee.division || ""
                  : initialEmployee.division || ""
              }
              icon={<AccountBalanceIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("division", value)}
            />
            <DetailItem
              label="Function"
              value={
                isEditing
                  ? editedEmployee.function || ""
                  : initialEmployee.function || ""
              }
              icon={<BuildIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("function", value)}
            />
            <DetailItem
              label="Grade"
              value={
                isEditing
                  ? editedEmployee.grade || ""
                  : initialEmployee.grade || ""
              }
              icon={<StarIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("grade", value)}
            />
          </Box>
        </Box>

        <Divider
          sx={{
            my: 3,
            borderColor: "rgba(0,0,0,0.08)",
            borderWidth: "1px",
          }}
        />

        {/* Additional sections... */}
        <Box
          sx={{
            padding: "16px",
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.7)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              color: "#2c3e50",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LocationOnIcon fontSize="medium" />
            Location Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 3,
            }}
          >
            <DetailItem
              label="Floor"
              value={
                isEditing
                  ? editedEmployee.floor || ""
                  : initialEmployee.floor || ""
              }
              icon={<BusinessIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("floor", value)}
            />
            <DetailItem
              label="Location"
              value={
                isEditing
                  ? editedEmployee.location || ""
                  : initialEmployee.location || ""
              }
              icon={<PublicIcon />}
              isEditing={isEditing}
              onChange={(value) => handleFieldChange("location", value)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Reusable detail item component
const DetailItem = ({ label, value, icon, isEditing, onChange }) => (
  <Box>
    <Typography
      variant="body2"
      sx={{
        color: "rgba(0, 0, 0, 0.77)",
        fontWeight: "600",
        mb: 1.7,
        display: "flex",
        alignItems: "center",
        fontSize: "1.2rem",
        gap: "6px",
      }}
    >
      {React.cloneElement(icon, { fontSize: "small" })}
      {label}
    </Typography>
    {isEditing ? (
      <TextField
        variant="outlined"
        fullWidth
        size="small"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
      />
    ) : (
      <Typography
        variant="body1"
        sx={{
          fontWeight: "500",
          color: "rgba(0, 0, 0, 0.73)",
          fontSize: "1.2rem",
        }}
      >
        {value}
      </Typography>
    )}
  </Box>
);

export default LeftCard;

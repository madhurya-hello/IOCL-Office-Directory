// Import necessary dependencies from React and libraries
import React, { useState } from "react"; // React for building UI, useState for managing component state
import { motion } from "framer-motion"; // Framer Motion for animations
import { FiDownload, FiX } from "react-icons/fi"; // Feather icons for download and close buttons (unused in this code)
import { Download, Close } from "@mui/icons-material"; // Material-UI icons for download and close actions
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for PDF download button
import GridOnIcon from "@mui/icons-material/GridOn"; // Icon for Excel download button

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions, // Material-UI components for modal dialog
  Button,
  IconButton,
  Checkbox,
  FormControlLabel, // Material-UI components for buttons and checkboxes
  Grid,
  Box,
  Typography,
  Divider, // Material-UI components for layout and typography
} from "@mui/material";

// Define the DownloadCard component, accepting props for configuration
const DownloadCard = ({
  columns, // Array of column objects with dataKey and header for download options
  onDownload, // Callback function to handle download action
  onClose, // Callback function to close the dialog
  selectedEmployeesCount, // Number of selected employees (unused in this code)
  selectMode, // Mode of selection (unused in this code)
}) => {
  // Initialize state to track which columns are selected for download
  const [selectedColumns, setSelectedColumns] = useState(
    // Create an object where each column's dataKey is a key with initial value false
    columns.reduce((acc, column) => {
      acc[column.dataKey] = false; // Set each column as unselected by default
      return acc;
    }, {})
  );

  // Function to toggle the selection state of a column
  const toggleColumn = (columnKey) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey], // Flip the boolean value for the specified column
    }));
  };

  // Render the dialog component
  return (
    // Material-UI Dialog component to display the download options modal
    <Dialog
      open={true} // Dialog is always open when component is rendered
      onClose={onClose} // Call onClose when user tries to close the dialog
      maxWidth="lg" // Set maximum width to large
      fullWidth // Make dialog take full available width
      PaperProps={{
        sx: {
          borderRadius: "16px", // Rounded corners for modern look
          overflow: "hidden", // Prevent content overflow
          background: "linear-gradient(145deg, #f5f7ff, #e6f0ff)", // Gradient background
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)", // Shadow for depth
        },
      }}
    >
      {/* Dialog title section */}
      <DialogTitle
        sx={{
          display: "flex", // Flexbox for layout
          justifyContent: "space-between", // Space out title and close button
          alignItems: "center", // Vertically center content
          backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue background
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
        }}
      >
        {/* Title text */}
        <Typography variant="h6" fontSize={25} fontWeight="600">
          Download Options
        </Typography>
        {/* Close button */}
        <IconButton
          onClick={onClose} // Trigger onClose when clicked
          sx={{
            backgroundColor: "rgb(192, 221, 248)", // Light blue background
            "&:hover": {
              backgroundColor: "rgb(243, 133, 133)", // Red background on hover
            },
            transition: "background-color 0.3s ease", // Smooth transition
            "& .MuiSvgIcon-root": {
              color: "rgba(0, 0, 0, 0.54)", // Icon color
              "&:hover": {
                color: "rgb(0, 0, 0)", // Black icon on hover
              },
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Dialog content section */}
      <DialogContent sx={{ padding: "2rem" }}>
        {/* Instruction text */}
        <Typography
          variant="body1"
          fontSize={20}
          fontWeight="500"
          mt={5}
          mb={1}
        >
          Select Columns to Download
        </Typography>

        {/* Divider for visual separation */}
        <Divider sx={{ my: 2 }} />

        {/* Grid to display column selection checkboxes */}
        <Grid
          container
          spacing={2}
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {columns.map((column) => (
            // Grid item for each column checkbox
            <Grid item xs={6} sm={4} md={3} key={column.dataKey}>
              <div>
                {/* Checkbox with label for column selection */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedColumns[column.dataKey]} // Reflect selection state
                      onChange={() => toggleColumn(column.dataKey)} // Toggle selection on change
                      color="primary" // Use primary theme color
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: "1.5rem", // Larger checkbox icon
                        },
                      }}
                    />
                  }
                  label={column.header} // Display column name
                  sx={{
                    backgroundColor: selectedColumns[column.dataKey]
                      ? "rgba(59, 130, 246, 0.1)" // Highlight selected columns
                      : "transparent",
                    borderRadius: "8px", // Rounded corners
                    padding: "8px", // Padding for better spacing
                    margin: 0, // Remove default margin
                    width: "100%", // Full width
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)", // Hover effect
                    },
                    "& .MuiTypography-root": {
                      fontSize: "1.2rem", // Larger label text
                    },
                  }}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      {/* Dialog actions section */}
      <DialogActions
        sx={{
          padding: "2.5rem 2rem", // Generous padding
          borderTop: "1px solid rgba(0, 0, 0, 0.1)", // Subtle border
        }}
      >
        {/* Container for download buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Excel download button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained" // Filled button style
              startIcon={<GridOnIcon />} // Excel icon
              onClick={() => onDownload("excel", selectedColumns)} // Trigger download as Excel
              sx={{
                borderRadius: "50px", // Pill-shaped button
                padding: "10px 24px", // Comfortable padding
                textTransform: "none", // Normal text case
                fontWeight: 600, // Bold text
                fontSize: "1.1rem", // Larger text
                backgroundColor: "#10b981", // Green color
                "&:hover": {
                  backgroundColor: "#0d9f6e", // Darker green on hover
                },
                "& .MuiButton-startIcon": {
                  "& > *:first-of-type": {
                    fontSize: "1.5rem", // Larger icon
                  },
                },
              }}
            >
              Excel
            </Button>
          </motion.div>

          {/* PDF download button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained" // Filled button style
              startIcon={<DescriptionIcon />} // PDF icon
              onClick={() => onDownload("pdf", selectedColumns)} // Trigger download as PDF
              sx={{
                borderRadius: "50px", // Pill-shaped button
                padding: "10px 24px", // Comfortable padding
                textTransform: "none", // Normal text case
                fontWeight: 600, // Bold text
                fontSize: "1.1rem", // Larger text
                backgroundColor: "#3b82f6", // Blue color
                "&:hover": {
                  backgroundColor: "#2563eb", // Darker blue on hover
                },
                "& .MuiButton-startIcon": {
                  "& > *:first-of-type": {
                    fontSize: "1.5rem", // Larger icon
                  },
                },
              }}
            >
              PDF
            </Button>
          </motion.div>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// Export the component for use in other parts of the application
export default DownloadCard;

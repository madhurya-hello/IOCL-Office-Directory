import  { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { Download, Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import DescriptionIcon from "@mui/icons-material/Description";
import GridOnIcon from "@mui/icons-material/GridOn";

const DownloadCardMUI = ({
  columns,
  onDownload,
  onClose,
  selectedEmployeesCount,
  selectMode,
}) => {
  // State for selected columns (all initially false)
  const [selectedColumns, setSelectedColumns] = useState(
    columns.reduce((acc, column) => {
      acc[column.dataKey] = false;
      return acc;
    }, {})
  );

  // Toggle column selection
  const toggleColumn = (columnKey) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          overflow: "hidden",
          background: "linear-gradient(145deg, #f5f7ff, #e6f0ff)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      {/* Dialog header with close button */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontSize={25} fontWeight="600">
          Download Options
        </Typography>
        {/* Close button with hover effects */}
        <IconButton
          onClick={onClose}
          sx={{
            backgroundColor: "rgb(192, 221, 248)",
            "&:hover": {
              backgroundColor: "rgb(243, 133, 133)",
            },

            transition: "background-color 0.3s ease",
            "& .MuiSvgIcon-root": {
              color: "rgba(0, 0, 0, 0.54)",
              "&:hover": {
                color: "rgb(0, 0, 0)",
              },
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      {/* Main content area */}

      <DialogContent sx={{ padding: "2rem" }}>
        {/* Column selection header */}
        <Typography
          variant="body1"
          fontSize={20}
          fontWeight="500"
          mt={5}
          mb={1}
        >
          Select Columns to Download
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Grid of selectable columns */}

        <Grid
          container
          spacing={2}
          sx={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {columns.map((column) => (
            <Grid item xs={6} sm={4} md={3} key={column.dataKey}>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedColumns[column.dataKey]}
                      onChange={() => toggleColumn(column.dataKey)}
                      color="primary"
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: "1.5rem",
                        },
                      }}
                    />
                  }
                  label={column.header}
                  sx={{
                    backgroundColor: selectedColumns[column.dataKey]
                      ? "rgba(59, 130, 246, 0.1)"
                      : "transparent",
                    borderRadius: "8px",
                    padding: "8px",
                    margin: 0,
                    width: "100%",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                    "& .MuiTypography-root": {
                      fontSize: "1.2rem",
                    },
                  }}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      {/* Action buttons */}
      <DialogActions
        sx={{
          padding: "2.5rem 2rem",
          borderTop: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="contained"
              startIcon={<GridOnIcon />}
              onClick={() => onDownload("excel", selectedColumns)}
              sx={{
                borderRadius: "50px",
                padding: "10px 24px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                backgroundColor: "#10b981",
                "&:hover": {
                  backgroundColor: "#0d9f6e",
                },
                "& .MuiButton-startIcon": {
                  "& > *:first-of-type": {
                    fontSize: "1.5rem",
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
              variant="contained"
              startIcon={<DescriptionIcon />}
              onClick={() => onDownload("pdf", selectedColumns)}
              sx={{
                borderRadius: "50px",
                padding: "10px 24px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                backgroundColor: "#3b82f6",
                "&:hover": {
                  backgroundColor: "#2563eb",
                },
                "& .MuiButton-startIcon": {
                  "& > *:first-of-type": {
                    fontSize: "1.5rem",
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

export default DownloadCardMUI;

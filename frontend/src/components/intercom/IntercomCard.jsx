
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import AddUser from "./AddUser";
import { motion } from "framer-motion";

const IntercomCard = ({
  employeeData,
  isLeftCardOpen,
  onCardClick,
  hasMore,
  onLoadMore,
  showAddUser,
  setShowAddUser,
  selectMode,
  selectedEmployees,
  onEmployeeSelect,
  gradeOptions = [],
  floorOptions = [],
}) => {
  // Handler for new employee submission
  const handleAddUserSubmit = (newEmployee) => {
   
    setShowAddUser(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Grid layout for employee cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isLeftCardOpen
            ? "repeat(3, 1fr)"
            : "repeat(4, 1fr)",
          gap: "16px",
          "@media (max-width: 1500px)": {
            gridTemplateColumns: isLeftCardOpen
              ? "repeat(2, 1fr)"
              : "repeat(3, 1fr)",
          },
          "@media (max-width: 1000px)": {
            gridTemplateColumns: "1fr",
          },
        }}
      >
        {employeeData.map((employee, index) => (
          <motion.div
            key={employee.id}
            style={{ cursor: "pointer", position: "relative" }}
            onClick={() => onCardClick(employee)}
            whileHover={{
              y: -6,
              transition: { duration: 0.2 },
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.11)",
            }}
          >
            {/* Selection overlay in select mode */}

            {selectMode && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: selectedEmployees.includes(employee.id)
                    ? "rgba(59, 130, 246, 0.2)"
                    : "rgba(255, 255, 255, 0.5)",
                  zIndex: 1,
                  borderRadius: "16px",
                  border: selectedEmployees.includes(employee.id)
                    ? "2px solid #3b82f6"
                    : "2px solid transparent",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEmployeeSelect(employee.id);
                }}
              />
            )}

            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                minWidth: "300px",
                minHeight: "240px",
                height: "350px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Selection checkbox in select mode */}

              {selectMode && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      onEmployeeSelect(employee.id);
                    }}
                    style={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                    }}
                  />
                </Box>
              )}
              <CardContent
                sx={{
                  padding: "16px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Employee name and status */}

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {employee.name || ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.designation || ""}
                    </Typography>
                  </Box>

                  {/* Status badge */}
                  <Box
                    sx={{
                      backgroundColor:
                        employee.status?.toLowerCase() === "active"
                          ? "#DFF5E1"
                          : "#FDECEA",
                      color:
                        employee.status?.toLowerCase() === "active"
                          ? "#388E3C"
                          : "#D32F2F",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      height: "fit-content",
                    }}
                  >
                    {employee.status || ""}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Employee details */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ color: "rgb(0,0,0)", fontSize: "1rem" }}>
                      Emp No
                    </span>
                    <span>{employee.empNo || "no data"}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ color: "rgb(0,0,0)", fontSize: "1rem" }}>
                      Intercom
                    </span>
                    <span>{employee.intercom || "no data"}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ color: "rgb(0,0,0)", fontSize: "1rem" }}>
                      Email
                    </span>
                    <span>{employee.email?.toLowerCase() || "no data"}</span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                      fontSize: "1rem",
                    }}
                  >
                    <span style={{ color: "rgb(0,0,0)", fontSize: "1rem" }}>
                      Phone
                    </span>
                    <span>{employee.phone || "no data"}</span>
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Additional info (grade, floor, intercom) */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Grade
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="500">
                      {employee.grade}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Floor
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="500">
                      {employee.floor}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      Intercom
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="500">
                      {employee.intercom}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Load more button (conditional) */}
      {hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            onClick={onLoadMore}
            sx={{
              borderRadius: "12px",
              padding: "12px 24px",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            Load More
          </Button>
        </Box>
      )}

      {/* Add User modal (conditional) */}
      {showAddUser && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <AddUser
            onClose={() => setShowAddUser(false)}
            onSubmit={handleAddUserSubmit}
            gradeOptions={gradeOptions}
            floorOptions={floorOptions}
          />
        </Box>
      )}
    </Box>
  );
};

export default IntercomCard;

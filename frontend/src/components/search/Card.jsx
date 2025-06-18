
import "./Card.css";
import { motion } from "framer-motion";

const Card = ({
  employee,
  onEmployeeClick,
  selectMode,
  onEmployeeSelect,
  isSelected,
  isAdmin,
}) => {
  // Handles card clicks differently based on selectMode
  const handleCardClick = (e) => {
    if (selectMode) {
      if (e.target.type !== "checkbox") {
        onEmployeeSelect(employee, !isSelected);
      }
    } else if (onEmployeeClick) {
      onEmployeeClick(employee);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 1, scale: 0.93 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.008 }}
        whileHover={{ scale: selectMode ? 1.03 : 1.05 }}
        className="card-container"
        onClick={handleCardClick}
        style={{
          position: "relative",
          backgroundColor: isSelected ? "rgba(59, 130, 246, 0.1)" : "white",
          border: isSelected ? "2px solid #3b82f6" : "1px solid #e5e7eb",
          cursor: "pointer",
        }}
      >
        {/* Selection checkbox (only in select mode) */}
        {selectMode && (
          <div className="card-checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onEmployeeSelect(employee, e.target.checked);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {/* Employee avatar with initial letter */}
        <div
          className="avatar"
          style={{ backgroundColor: employee.avatarColor }}
        >
          {employee.name.charAt(0)}
        </div>
        {/* Employee details */}
        <div className="card-content">
          <h3 className="employee-name">{employee.name}</h3>
          <p className="employee-designation">{employee.designation}</p>
          <p className="employee-division">{employee.division}</p>
          <p className="employee-division">{employee.phone}</p>
          <p className="employee-division">{employee.email?.toLowerCase()}</p>
        </div>
      </motion.div>
    </>
  );
};

export default Card;

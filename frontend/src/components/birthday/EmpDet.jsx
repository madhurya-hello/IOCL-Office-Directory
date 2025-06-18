import { motion } from "framer-motion";
import { getColorForName } from "../helpers/profileUtils.js";

/**
 * Employee Details component that displays a list of birthdays for the selected date.
 * Includes animations and hover effects for better user experience.
 *
 */
const EmpDet = ({ birthdays, onEmployeeClick }) => {
  return (
    <motion.div
      style={{
        flex: 1,
        minWidth: "450px",
        maxWidth: "550px",
        height: "74.1rem",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Container with animation effects */}
      <motion.div
        style={{
          width: "100%",
          padding: "1.5rem",
          backgroundColor: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.8rem",
          boxShadow: "10px 20px 40px 0px rgba(0, 0, 0, 0.05)",
          height: "100%",
        }}
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: "-0.5rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.7rem",
              fontWeight: "bold",
              color: "#111827",
              textAlign: "center",
            }}
          >
            Birthdays
          </h3>
        </div>

        {/* Decorative divider line */}
        <div
          style={{
            height: "1.6px",
            margin: "2rem 0 2.2rem 0",
            width: "100%",
            backgroundImage:
              "linear-gradient(to right, transparent, rgba(0, 0, 0, 0.33), rgba(22, 16, 16, 0.9), rgba(0, 0, 0, 0.3), transparent)",
          }}
        ></div>

        {/* Birthday list container */}
        <div style={{ overflow: "hidden" }}>
          <ul
            style={{
              listStyle: "none",
              padding: "0 0.5rem",
              margin: 0,
            }}
          >
            {/* Check if there are birthdays to display */}
            {birthdays && birthdays.length > 0 ? (
              birthdays.map((person, index) => (
                <motion.li
                  key={index}
                  style={{ padding: "1.2rem 0", cursor: "pointer" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100,
                    duration: 0.01,
                  }}
                  whileHover={{
                    scale: 1.01,
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    transition: {
                      delay: 0,
                      scale: { duration: 0.01 },
                      backgroundColor: { duration: 0.01 },
                    },
                  }}
                >
                  {/* Employee information row */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ flexShrink: 0 }}>
                      <div
                        style={{
                          width: "3.7rem",
                          height: "3.7rem",
                          borderRadius: "50%",
                          backgroundColor: getColorForName(person.name),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                        }}
                      >
                        {person.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Employee details */}
                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                        marginLeft: "1.8rem",
                        overflow: "hidden",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: 500,
                          color: "#111827",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          marginBottom: "0.3rem", // Added margin
                        }}
                      >
                        {person.name}
                      </p>
                      <p
                        style={{
                          fontSize: "1.3rem",
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {person.email.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              /* Empty state when no birthdays */
              <motion.li
                style={{
                  padding: "1.5rem",
                  textAlign: "center",
                  color: "#6b7280",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                No birthdays on this day
              </motion.li>
            )}
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmpDet;

import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { CircularProgress } from "@mui/material";

// Main container for comparison view - flex layout with gap
const ComparisonContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: calc(100% - 60px);
  min-height: 0;
  overflow: hidden;
  z-index: 15;
`;
// Card component for displaying data with animation capabilities
const DataCard = styled(motion.div)`
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow-y: auto;
  border: 1px solid ${(props) => (props.type === "old" ? "#f3f4f6" : "#e0f2fe")};
  min-height: 0;
`;
// Header for each card with type-based styling
const CardHeader = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => (props.type === "old" ? "#2A88D4" : "#2A88D4")};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid
    ${(props) => (props.type === "old" ? "#f3f4f6" : "#e0f2fe")};
`;
// Container for each field row
const FieldContainer = styled.div`
  margin-bottom: 1rem;
`;
// Label for each field (small, gray text)
const FieldLabel = styled.span`
  display: block;
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.3rem;
`;
// Value display for each field with optional highlight
const FieldValue = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #111827;
  padding: 0.5rem;
  background-color: ${(props) =>
    props.highlight ? "rgba(192, 240, 207, 0.56)" : "transparent"};
  border-radius: 4px;
  word-break: break-word;
`;
// Special highlighted value style (blue and bold)
const HighlightValue = styled(FieldValue)`
  color: #2a88d4;
  font-weight: 600;
`;

const Comparison = ({ oldData, newData, compLoaded }) => {
  // List of fields to exclude from comparison display
  const excludedFields = [
    "password",
    "logged",
    "lastLogged",
    "admin",
    "message",
  ];
  // Loading state display
  if (!compLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <CircularProgress size={40} />
      </div>
    );
  }

  // Function to check if a field value has changed between old and new data
  const hasChanged = (field) => {
    return oldData[field] !== newData[field];
  };

  // Filtering out excluded fields from the data keys
  const fields = Object.keys(oldData).filter(
    (field) => !excludedFields.includes(field)
  );

  // Main return with two animated cards (old vs new data)
  return (
    <ComparisonContainer>
      {/* Current Data Card - slides in from left */}
      <DataCard
        type="old"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <CardHeader type="old">Current Data</CardHeader>
        {fields.map((field) => (
          <FieldContainer key={`old-${field}`}>
            <FieldLabel>{field}</FieldLabel>
            <FieldValue>{oldData[field] || "-"}</FieldValue>
          </FieldContainer>
        ))}
      </DataCard>

      {/* Updated Data Card - slides in from right */}
      <DataCard
        type="new"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <CardHeader type="new">Updated Data</CardHeader>
        {fields.map((field) => (
          <FieldContainer key={`new-${field}`}>
            <FieldLabel>{field}</FieldLabel>
            {hasChanged(field) ? (
              <HighlightValue highlight>{newData[field] || "-"}</HighlightValue>
            ) : (
              <FieldValue>{newData[field] || "-"}</FieldValue>
            )}
          </FieldContainer>
        ))}
      </DataCard>
    </ComparisonContainer>
  );
};

export default Comparison;

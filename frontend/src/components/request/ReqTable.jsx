import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import Comparison from "./Comparison";
import { FiX } from "react-icons/fi";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// Base table styles
const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
`;
// Table header with sticky positioning
const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  z-index: 10;
`;
// Table body with overflow control
const TableBody = styled.tbody`
  overflow-y: auto;
  width: 100%;
`;
// Table header cell styling
const Th = styled.th`
  background-color: #2a88d4;
  color: white;
  text-align: left;
  padding: 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
`;
// Table data cell styling
const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgb(231, 231, 231);
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  color: rgb(32, 36, 41);
  word-break: break-word;
`;
// Table row with hover effects and animations
const Tr = styled(motion.tr)`
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background-color: #f9fafb;
  }

  &:last-child td {
    border-bottom: none;
  }
`;
// Action buttons (approve/reject) with color variants
const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${(props) => (props.approve ? "#10b981" : "#ef4444")};
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    background-color: ${(props) => (props.approve ? "#059669" : "#dc2626")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;
// Load more button at bottom of table
const LoadMoreButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  margin: 1rem auto;
  display: block;
  font-size: 1rem;
  font-weight: 550;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: #2a88d4;
  transition: all 0.2s ease;

  &:hover {
    background-color: #1a6cb0;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
// Special cell for messages with empty state styling
const MessageCell = styled(Td)`
  color: ${(props) => (props.empty ? "#9ca3af" : "#111827")};
  font-style: ${(props) => (props.empty ? "italic" : "normal")};
`;
// Footer container for load more button
const TableFooter = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;
// Name cell with custom styling and hover effects
const NameCell = styled(Td)`
  color: rgb(2, 13, 22);
  cursor: default;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
`;
// Confirmation dialog overlay
const ConfirmationDialog = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
// Confirmation dialog content area
const DialogContent = styled(motion.div)`
  background-color: white;
  padding: 2rem;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  border-radius: 12px;
  max-width: 30vw;
  max-height: 60vh;
  height: auto;
  width: 100%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;
// Button container in dialog
const DialogButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;
// Individual dialog buttons with confirm/cancel variants
const DialogButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;

  &:first-child {
    background-color: #f3f4f6;
    color: #374151;

    &:hover {
      background-color: #e5e7eb;
    }
  }

  &:last-child {
    background-color: ${(props) => (props.confirm ? "#10b981" : "#ef4444")};
    color: white;

    &:hover {
      background-color: ${(props) => (props.confirm ? "#059669" : "#dc2626")};
    }
  }
`;
// Request modal overlay
const RequestModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
// Request modal content area
const ModalContent = styled(motion.div)`
  background-color: white;
  width: 70vw;
  height: 90vh;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;
// Modal header style
const ModalHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2a88d4;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 1rem;
`;
// Message box for request notes
const MessageBox = styled.div`
  background-color: #f8f9fa;
  border-left: 4px solid #2a88d4;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 4px;
  font-size: 1.1rem;
  color: #333;
`;

const ReqTable = ({
  id,
  requests,
  onApprove,
  onReject,
  newData,
  setNewData,
  isLoading,
  setReqMessage,
  showRequestModal,
  setShowRequestModal,
}) => {
  // State for visible items count (pagination)
  const [visibleCount, setVisibleCount] = useState(10);

  // State for confirmation dialog visibility
  const [showDialog, setShowDialog] = useState(false);

  // State for currently selected request
  const [selectedRequest, setSelectedRequest] = useState(null);

  // State for current action type (approve/reject)
  const [currentAction, setCurrentAction] = useState(null);

  // State for current request ID being processed
  const [currentRequestId, setCurrentRequestId] = useState(null);

  // State for old/original data
  const [oldData, setOldData] = useState(null);

  // State for rejection reason input
  const [rejectionReason, setRejectionReason] = useState("");

  // State for comparison data loading status
  const [compLoaded, setCompLoaded] = useState(false);

  // Function to close modal overlay
  const closeOverlay = () => {
    setShowRequestModal(false);
  };
  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0,
        duration: 0,
      },
    }),
  };
  // Animation variants for table container
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };
  // Animation variants for action buttons
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
  };
  // Animation variants for load more button
  const loadMoreVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  // Function to load more items
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  // Function to handle action button clicks
  const handleActionClick = (action, requestId) => {
    setCurrentAction(action);
    setCurrentRequestId(requestId);
    setShowDialog(true);
  };

  // Function to confirm approve/reject action
  const handleConfirm = () => {
    const selectedRequest = requests.find(
      (req) => req.requestId === currentRequestId
    );

    if (currentAction === "approve") {
      onApprove(selectedRequest.requestId, selectedRequest.empId);
    } else {
      onReject(selectedRequest.requestId, selectedRequest.empId);
    }
    setShowDialog(false);
    setRejectionReason("");
    setReqMessage("");
  };

  // Function to handle name click and fetch comparison data
  const handleNameClick = async (req) => {
    try {
      setShowRequestModal(true);
      setCompLoaded(false);

      const currentDataResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/getSpecificData?id=${req.empId}`
      );
      setOldData(currentDataResponse.data);

      const requestedChangesResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/requestsDataSpecific?requestId=${req.requestId}`
      );
      setNewData(requestedChangesResponse.data);

      setSelectedRequest(req);
      setCompLoaded(true);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setCompLoaded(true);
    }
  };

  const visibleRequests = requests.slice(0, visibleCount);
  const canLoadMore = visibleCount < requests.length;

  // Loading state display (shows spinner)
  if (isLoading) {
    return (
      <>
        {/* Main table structure */}
        <Table>
          {/* Table header row */}
          <TableHeader>
            <tr>
              <Th>Employee No</Th>
              <Th>Name</Th>
              <Th>Requested On</Th>
              <Th>Email</Th>
              <Th>Phone Number</Th>
              <Th>Actions</Th>
            </tr>
          </TableHeader>

          {/* Table body with mapped requests */}
          <TableBody
            as={motion.tbody}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Tr
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              style={{
                transition: "all 0.2s ease",
                backgroundColor: "transparent",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <td
                colSpan={6}
                style={{
                  textAlign: "center",
                  fontSize: "1.5rem",
                  padding: "1rem",
                }}
              >
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
              </td>
            </Tr>
          </TableBody>
        </Table>
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <tr>
            <Th>Employee No</Th>
            <Th>Name</Th>
            <Th>Requested On</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Actions</Th>
          </tr>
        </TableHeader>

        <TableBody>
          {visibleRequests.map((req, index) => (
            <Tr
              key={req.requestId}
              style={{
                transition: "all 0.2s ease",
                backgroundColor: "transparent",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f9f9f9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Td onClick={() => handleNameClick(req)}>{req.empNo}</Td>
              <Td onClick={() => handleNameClick(req)}>{req.name}</Td>
              <Td onClick={() => handleNameClick(req)}>{req.requestDate}</Td>
              <Td onClick={() => handleNameClick(req)}>
                {req.email?.toLowerCase() || "N/A"}
              </Td>
              <Td onClick={() => handleNameClick(req)}>
                {req.mobile || "N/A"}
              </Td>
              <Td>
                <Button
                  approve
                  onClick={() => handleActionClick("approve", req.requestId)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleActionClick("reject", req.requestId)}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Reject
                </Button>
              </Td>
            </Tr>
          ))}
        </TableBody>
      </Table>

      {/* Request Details Modal */}
      {showRequestModal && (
        <RequestModal
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          onClick={() => setShowRequestModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>REQUESTED CHANGES</ModalHeader>

            {/*  message box */}
            <MessageBox>
              {compLoaded
                ? selectedRequest?.message || "No additional message provided"
                : "Loading message..."}
            </MessageBox>

            <button
              onClick={() => setShowRequestModal(false)}
              style={{
                position: "absolute",
                top: "1.5rem",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.46)",
                border: "none",
                borderRadius: "50%",
                width: "2.5rem",
                height: "2.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 1001,
                transition: "all 0.2s ease",
                color: "#555",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgb(245, 164, 164)";
                e.currentTarget.style.color = "rgb(0, 0, 0)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.46)";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiX size={20} />
            </button>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Comparison
                compLoaded={compLoaded}
                oldData={oldData}
                newData={newData}
              />
            </div>
          </ModalContent>
        </RequestModal>
      )}

      {/* Confirmation Dialog */}
      {showDialog && (
        <ConfirmationDialog
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
        >
          <DialogContent
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
          >
            <div style={{ width: "100%", marginBottom: "1rem" }}>
              <h3
                style={{ marginTop: 0, marginBottom: "1rem", fontSize: "2rem" }}
              >
                {currentAction === "approve"
                  ? "Approve Request"
                  : "Reject Request"}
              </h3>
              <p style={{ margin: "0.5rem 0", fontSize: "1.3rem" }}>
                Are you sure you want to {currentAction} this request?
              </p>
              <p
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "rgb(216, 55, 55)",
                }}
              >
                This action cannot be undone.
              </p>
            </div>

            {currentAction === "reject" && (
              <div
                style={{
                  width: "100%",
                  margin: "1rem 0",
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <textarea
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);
                    setReqMessage(e.target.value);
                  }}
                  placeholder="Enter reason for rejection..."
                  style={{
                    width: "100%",
                    minHeight: "8rem",
                    maxHeight: "8rem",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    fontSize: "1.2rem",
                    fontFamily: '"Inter", sans-serif',
                    resize: "vertical",
                    flex: 1,
                  }}
                />
              </div>
            )}

            <DialogButtons>
              <DialogButton onClick={() => setShowDialog(false)}>
                Cancel
              </DialogButton>
              <DialogButton
                confirm={currentAction === "approve"}
                onClick={handleConfirm}
              >
                {currentAction === "approve"
                  ? "Confirm Approve"
                  : "Confirm Reject"}
              </DialogButton>
            </DialogButtons>
          </DialogContent>
        </ConfirmationDialog>
      )}

      {/* Load More Button */}
      {canLoadMore && (
        <TableFooter>
          <LoadMoreButton
            onClick={handleLoadMore}
            variants={loadMoreVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
          >
            Load More
          </LoadMoreButton>
        </TableFooter>
      )}
    </>
  );
};

export default ReqTable;

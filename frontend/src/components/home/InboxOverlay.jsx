import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoSearch } from "react-icons/io5";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { fetchInboxData, fetchSenderMessages } from "../../store/messageSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Inbox overlay component showing messages and conversations
 * @param {function} onClose - Callback to close the overlay
 */
const InboxOverlay = ({ onClose }) => {
  // Redux state management
  const dispatch = useDispatch();
  const {
    inboxData,
    inboxLoading,
    inboxError,
    senderMessages,
    senderMessagesLoading,
    senderMessagesError,
  } = useSelector((state) => state.message);

  // Local state
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [expanded, setExpanded] = useState(false); // Whether message view is expanded
  const [showUnreadOnly, setShowUnreadOnly] = useState(false); // Filter toggle
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [conversations, setConversations] = useState([]); // Local copy of inbox data
  const [currentMessages, setCurrentMessages] = useState([]); // Messages for selected conversation

  // Fetch initial inbox data
  useEffect(() => {
    dispatch(fetchInboxData());
  }, [dispatch]);

  // Update local conversations when Redux data changes
  useEffect(() => {
    setConversations(inboxData);
  }, [inboxData]);

  // Update current messages when Redux data changes
  useEffect(() => {
    setCurrentMessages(senderMessages);
  }, [senderMessages]);

  /**
   * Handles clicking on a conversation
   * @param {object} message - The selected conversation
   */
  const handleMessageClick = (message) => {
    // Mark as read if unread messages exist
    if (message.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) =>
          c.empId === message.empId ? { ...c, unreadCount: 0 } : c
        )
      );
    }
    setSelectedMessage({ ...message, unreadCount: 0 });
    setExpanded(true);
    dispatch(fetchSenderMessages({ senderId: message.empId })); // Fetch messages
  };

  // Toggle unread filter
  const toggleUnreadFilter = () => setShowUnreadOnly(!showUnreadOnly);

  // Handle search input
  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  // Filter and sort conversations based on search and filter
  const filteredConversations = conversations
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm) &&
        (!showUnreadOnly || c.unreadCount > 0)
    )
    .sort(
      (a, b) =>
        showUnreadOnly
          ? b.unreadCount - a.unreadCount // Sort by unread count
          : new Date(b.timestamp) - new Date(a.timestamp) // Sort by timestamp
    );

  /**
   * Truncates long messages for preview
   * @param {string} message - Message text
   * @returns {string} Truncated message
   */
  const truncateMessage = (message) => {
    if (message.length > 40) {
      return `${message.substring(0, 40)}...`;
    }
    return message;
  };

  /**
   * Renders the messages for the selected conversation
   * @returns {JSX} Message list or loading/error states
   */
  const renderMessages = () => {
    if (!selectedMessage) return null;

    // Loading state
    if (senderMessagesLoading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20%",
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    // Error state
    if (senderMessagesError) {
      return (
        <div
          style={{
            padding: "1rem",
            color: "red",
            textAlign: "center",
          }}
        >
          Error loading messages: {senderMessagesError}
        </div>
      );
    }

    // Message list
    return (
      <>
        {currentMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              backgroundColor: msg.sender === "You" ? "#e3f2fd" : "white",
              padding: "1rem",
              borderRadius: "1rem",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
              marginBottom: "1rem",
              alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <p>{msg.message}</p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#666",
                textAlign: "right",
                marginTop: "0.5rem",
              }}
            >
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </>
    );
  };

  return (
    // Overlay background
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(37, 129, 216, 0.2)",
        backdropFilter: "blur(6px)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
      onClick={onClose} // Close when clicking outside
    >
      {/* Main content container with animation */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.1 }}
        style={{
          backgroundColor: "white",
          borderRadius: "1rem",
          width: expanded ? "70vw" : "40vw",
          height: "80vh",
          overflow: "hidden",
          display: "flex",
          border: "1px solid #e0e0e0",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Left panel - conversation list */}
        <div
          style={{
            width: expanded ? "40%" : "100%",
            borderRight: expanded ? "1px solid #eee" : "none",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with close button */}
          <div
            style={{
              padding: "1.5rem",
              background: "linear-gradient(90deg, #257fd8, #4aa3f0)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Messages</h2>
            <motion.button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                backgroundColor: "rgb(141, 194, 243)",
                color: "rgb(73, 71, 71)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                padding: 0,
              }}
              whileHover={{
                backgroundColor: "rgb(243, 133, 133)",
                color: "black",
                scale: 1.1,
              }}
              whileTap={{
                scale: 0.9,
              }}
            >
              <CloseIcon fontSize="medium" style={{ fontSize: "1.5rem" }} />
            </motion.button>
          </div>

          {/* Search and filter controls */}
          <div
            style={{
              padding: "1rem",
              display: "flex",
              gap: "1rem",
              backgroundColor: "#f0f4f8",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <IoSearch style={{ marginRight: "0.5rem", color: "#777" }} />
              <input
                type="text"
                placeholder="Search name..."
                style={{
                  border: "none",
                  background: "none",
                  outline: "none",
                  width: "100%",
                }}
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={toggleUnreadFilter}
              style={{
                backgroundColor: showUnreadOnly ? "#257fd8" : "white",
                color: showUnreadOnly ? "white" : "#257fd8",
                border: "1px solid #257fd8",
                borderRadius: "0.5rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
              }}
            >
              Unread Only
            </button>
          </div>

          {/* Conversation list */}
          <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
            {inboxLoading ? (
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
              </div>
            ) : inboxError ? (
              <div
                style={{
                  padding: "1rem",
                  color: "red",
                  textAlign: "center",
                  marginTop: "1.7rem",
                }}
              >
                Error loading messages: {inboxError}
              </div>
            ) : (
              filteredConversations.map((convo) => (
                <div
                  key={convo.empId}
                  onClick={() => handleMessageClick(convo)}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #eee",
                    backgroundColor:
                      selectedMessage?.empId === convo.empId
                        ? "#e8f1fc"
                        : "white",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "1.4rem",
                    }}
                  >
                    <span style={{ fontWeight: 540 }}>{convo.name}</span>
                    {convo.unreadCount > 0 && (
                      <span
                        style={{
                          backgroundColor: "rgb(143, 252, 157)",
                          color: "rgb(51, 51, 51)",
                          borderRadius: "50%",
                          width: "2rem",
                          height: "2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.3rem",
                        }}
                      >
                        {convo.unreadCount}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      color: "#555",
                      fontSize: "1.05rem",
                      marginTop: "0.3rem",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {truncateMessage(convo.message)}
                  </p>
                  <p
                    style={{
                      color: "rgba(0, 0, 0, 0.62)",
                      fontSize: "0.9rem",
                      marginTop: "0.3rem",
                    }}
                  >
                    {new Date(convo.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel - expanded message view */}
        {expanded && selectedMessage && (
          <motion.div
            initial={{ opacity: 1, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#f1f5f9",
            }}
          >
            {/* Message header with back button */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 600,
                    marginBottom: "0.2rem",
                  }}
                >
                  {selectedMessage.name}
                </h3>
                <p style={{ color: "#aaa", fontSize: "0.85rem" }}>
                  {new Date(selectedMessage.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setExpanded(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                }}
              >
                <ArrowBackIosIcon />
              </button>
            </div>

            {/* Message content area */}
            <div
              style={{
                flex: 1,
                padding: "2rem",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {renderMessages()}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default InboxOverlay;

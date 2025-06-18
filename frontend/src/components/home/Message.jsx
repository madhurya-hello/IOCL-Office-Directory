import  { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import TelegramIcon from "@mui/icons-material/Telegram";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBirthdayData,
  sendBirthdayMessage,
} from "../../store/messageSlice";
import { CircularProgress } from "@mui/material";

const Message = ({ birthday }) => {
  // Redux state management
  const dispatch = useDispatch();
  const { birthdayData, loading, error, sendingMessage } = useSelector(
    (state) => state.message
  );

  const [allContacts, setAllContacts] = useState([]);

  // Effect for initial data fetch
  useEffect(() => {
    if (birthdayData.length === 0) {
      dispatch(fetchBirthdayData());
    }
  }, [dispatch]);

  // Effect to update local contacts when Redux data changes
  useEffect(() => {
    if (birthdayData.length > 0) {
      setAllContacts(birthdayData);
    }
  }, [birthdayData]);

  // Local state declarations with explanations
  const [visibleCount, setVisibleCount] = useState(15);
  const currentDate = new Date();
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [message, setMessage] = useState("");
  const [hoverSend, setHoverSend] = useState(false);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const visibleContacts = allContacts.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + 15); // Increase visible items count
  };

  const handleSendClick = (contact) => {
    setSelectedRecipient(contact); // Increase visible items count
  };

  // Message sending handler with error handling
  const handleSendMessage = () => {
    if (!selectedRecipient || !message.trim()) {
      toast.error("Please enter a message", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    dispatch(
      sendBirthdayMessage({
        receiverId: selectedRecipient.empId,
        message: message,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(
          `Message successfully sent to ${selectedRecipient.name}!`,
          {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        setMessage("");
      })
      .catch((error) => {
        toast.error(`Failed to send message: ${error}`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  // Loading state UI
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "70vw",
          height: "10vh",
          margin: "0rem auto",
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderRadius: "1.5rem",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <CircularProgress size={60} style={{ color: "#257fd8" }} />
          <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
            Loading data...
          </p>
        </div>
      </motion.div>
    );
  }
  // Error state UI
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 1, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "70vw",
          height: "10vh",
          margin: "0rem auto",
          padding: "2rem",
          backgroundColor: "rgba(255, 255, 255, 0)",
          borderRadius: "1.5rem",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "red", fontSize: "1.2rem" }}>
            Error loading data : {error}
          </p>
        </div>
      </motion.div>
    );
  }

  // Main component return with section comments
  return (
    <motion.div
      initial={{ opacity: 1, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        width: "100%",
        maxWidth: "70vw",
        height: "85vh",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderRadius: "1.5rem",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header section with date */}
      <div style={{ marginBottom: "1rem" }}>
        <h2
          style={{
            fontSize: "3.5rem",
            color: "rgb(29, 101, 168)",
            marginBottom: "0.5rem",
            fontFamily: "Rowdies",
            fontWeight: "400",
            fontStyle: "normal",
            textAlign: "center",
          }}
        >
          🎂🎂 Celebrating Today's Birthdays 🎉🎉
        </h2>

        <h3
          style={{
            fontSize: "1.5rem",
            color: "#4a6baf",
            marginBottom: "1rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {formattedDate}
        </h3>
      </div>

      {/* Contacts table section */}
      <div
        style={{
          overflowY: "auto",
          flex: 1,
          marginBottom: "1rem",
          borderRadius: "1rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr
              style={{
                backgroundColor: "rgba(37, 129, 216, 0.9)",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Phone</th>
              <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
              <th style={{ padding: "1rem", textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleContacts.map((contact, index) => (
              <tr
                key={index}
                style={{
                  borderBottom: "1px solid #eee",
                  backgroundColor:
                    index % 2 === 0
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(240, 240, 240, 0.7)",
                  fontSize: "1.15rem",
                  fontWeight: "500",
                }}
              >
                <td style={{ padding: "1rem" }}>{contact.name}</td>
                <td style={{ padding: "1rem" }}>
                  {contact.phone ? contact.phone : ""}
                </td>
                <td style={{ padding: "1rem" }}>
                  {contact.email ? contact.email.toLowerCase() : ""}
                </td>
                <td style={{ padding: "1rem", textAlign: "center" }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendClick(contact)}
                    style={{
                      backgroundColor: "rgba(37, 129, 216, 0.9)",
                      color: "white",
                      border: "none",
                      borderRadius: "2rem",
                      padding: "0.5rem 1.5rem",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Send Wish
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More button (only shows if there are more contacts to load) */}
      {visibleCount < allContacts.length && (
        <div style={{ textAlign: "center" }}>
          <motion.button
            onClick={loadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "rgba(37, 129, 216, 0.9)",
              color: "white",
              border: "none",
              borderRadius: "2rem",
              padding: "0.8rem 2rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "0.5rem",
            }}
          >
            Load More ({allContacts.length - visibleCount} remaining)
          </motion.button>
        </div>
      )}
      
      {/* Message modal (conditional) */}
      {selectedRecipient && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => {
            setSelectedRecipient(null);
            setMessage("");
          }}
        >
          <ToastContainer />
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              width: "100%",
              maxWidth: "50vw",
              height: "100%",
              maxHeight: "60vh",
              backgroundColor: "white",
              borderRadius: "1rem",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#257fd8",
                padding: "1rem",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ChatBubbleIcon fontSize="large" /> Send Birthday Wish
              <motion.button
                onClick={() => {
                  setSelectedRecipient(null);
                  setMessage("");
                }}
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
                <CloseIcon
                  fontSize="medium"
                  style={{
                    fontSize: "1.5rem",
                  }}
                />
              </motion.button>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <p style={{ margin: 0, fontSize: "1.35rem" }}>
                <strong>To:</strong> {selectedRecipient.name}
              </p>
              <p style={{ margin: 0, fontSize: "1.35rem" }}>
                <strong>Subject:</strong> Wishing Happy Birthday
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "1.2rem",
                  color: "rgb(40, 173, 13)",
                  fontWeight: "bold",
                }}
              >
                Note: You can send multiple messages !!
              </p>

              <textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={2000}
                style={{
                  flex: 1,
                  width: "100%",
                  border: "1px solid rgba(0, 0, 0, 0.47)",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                  fontSize: "1.5rem",
                  resize: "none",
                }}
              ></textarea>
              <p
                style={{
                  textAlign: "right",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                {2000 - message.length} characters remaining
              </p>
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleSendMessage}
                style={{
                  backgroundColor: hoverSend
                    ? "rgba(37, 129, 216, 0.9)"
                    : "rgba(94, 159, 219, 0.9)",
                  color: "white",
                  padding: sendingMessage ? "0.8rem 0.96rem" : "0.8rem 0.8rem",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
                onMouseEnter={() => setHoverSend(true)}
                onMouseLeave={() => setHoverSend(false)}
              >
                {sendingMessage ? (
                  <CircularProgress size={29} style={{ color: "white" }} />
                ) : (
                  <TelegramIcon fontSize="large" />
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Message;

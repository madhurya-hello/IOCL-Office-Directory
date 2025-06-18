import React, { useState } from "react";
import { motion } from "framer-motion";
import birthdayImage from "../../assets/birthday-envelope2.png";
import balloon1 from "../../assets/balloon1.png";
import balloon2 from "../../assets/balloon2.png";
import balloon3 from "../../assets/balloon3.png";
import birthdayCardBackground from "../../assets/birthdaycard.jpg";
import InboxOverlay from "./InboxOverlay";

/**
 * Inbox component displaying a birthday card with animated balloons
 * and a button to open the message overlay
 */
const Inbox = () => {
  const [showOverlay, setShowOverlay] = useState(false); // Controls overlay visibility

  // Animation variants for floating balloons
  const balloonVariants = {
    hidden: { y: 200, opacity: 0 }, // Start position (off-screen bottom)
    visible: {
      y: -200, // End position (above container)
      opacity: [0, 1, 1, 0], // Fade in/out during animation
      transition: {
        duration: 3, // Total animation time
        ease: "linear", // Smooth movement
        times: [0, 0.2, 0.8, 1], // Keyframes for opacity changes
        repeat: Infinity, // Loop continuously
        repeatDelay: 1, // Pause between loops
      },
    },
  };

  return (
    <>
      {/* Birthday card container */}
      <div
        style={{
          backgroundImage: `url(${birthdayCardBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "2rem",
          padding: "2rem",
          boxShadow: "4px 4px 25px rgba(0, 0, 0, 0)",
          textAlign: "center",
          maxWidth: "50vw",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          marginTop: "-5rem",
        }}
      >
        {/* Animated Balloons */}
        <motion.img
          src={balloon1}
          alt="Balloon"
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: "8rem",
            zIndex: 1,
          }}
          variants={balloonVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.img
          src={balloon2}
          alt="Balloon"
          style={{
            position: "absolute",
            left: "50%",
            width: "7rem",
            zIndex: 1,
          }}
          variants={balloonVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }} // Staggered start time
        />
        <motion.img
          src={balloon3}
          alt="Balloon"
          style={{
            position: "absolute",
            left: "70%",
            width: "18rem",
            zIndex: 10,
          }}
          variants={balloonVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }} // Staggered start time
        />

        {/* Birthday envelope image */}
        <img
          src={birthdayImage}
          alt="Birthday Card"
          style={{
            width: "38rem",
            margin: "1rem auto",
            display: "block",
            position: "relative",
            zIndex: 2,
          }}
        />

        {/* Main title */}
        <h2
          style={{
            fontSize: "2.7rem",
            color: "rgb(233, 115, 37)",
            fontWeight: "bold",
            marginBottom: "0.5rem",
            position: "relative",
            zIndex: 2,
          }}
        >
          IOCL Wishes You A Very Happy Birthday...!
        </h2>

        {/* Unread messages count */}
        <p
          style={{
            fontSize: "1.5rem",
            color: "#333",
            fontWeight: 530,
            marginBottom: "0.5rem",
          }}
        >
          You have unread wishes
        </p>

        {/* Inbox button with hover/tap animations */}
        <motion.button
          whileHover={{ scale: 1.05 }} // Grow on hover
          whileTap={{ scale: 0.95 }} // Shrink on click
          style={{
            backgroundColor: "#257fd8",
            color: "white",
            border: "none",
            borderRadius: "2rem",
            padding: "0.8rem 2rem",
            fontSize: "1.2rem",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
          }}
          onClick={() => setShowOverlay(true)} // Open overlay
        >
          Inbox
        </motion.button>
      </div>

      {/* Conditionally render overlay */}
      {showOverlay && <InboxOverlay onClose={() => setShowOverlay(false)} />}
    </>
  );
};

export default Inbox;

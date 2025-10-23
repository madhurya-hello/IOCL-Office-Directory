import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Hook for accessing location data
import homeImage from "../assets/Home2.jpeg"; // Background image
import Welcome from "../components/home/Welcome"; // Welcome component
import Username from "../components/home/Username"; // Username display component
import Inbox from "../components/home/Inbox"; // Inbox component for birthday messages
import Message from "../components/home/Message"; // Message component
import { motion } from "framer-motion"; // Animation library
import axios from "axios"; // HTTP client for API requests

// Home component for displaying the main dashboard
const Home = () => {
  const location = useLocation(); // Get current location
  const [animate, setAnimate] = useState(false); // Animation state
  const [birthday, setBirthday] = useState(false); // Birthday status
  const [loading, setLoading] = useState(true); // Loading state
  const currentUser = JSON.parse(localStorage.getItem("authState")); // Current user from localStorage

  // Handle page load and birthday status fetch
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top
    setAnimate(true); // Trigger animation

    // Fetch birthday status from API
    const fetchBirthdayStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/birthday/isBirthday?emp_id=${currentUser.id}`
        );
        setBirthday(response.data.birthday);
      } catch (error) {
        console.error("Error fetching birthday status:", error);
        setBirthday(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdayStatus();

    // Cleanup animation state
    return () => {
      setAnimate(false);
    };
  }, [location.pathname]);

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Fixed Background Image (lowest layer) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          zIndex: 1,
          marginTop: "-15rem",
        }}
      >
        <img
          src={homeImage}
          alt="Home Banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            objectPosition: "center",
            filter: "blur(3px) brightness(0.9)",
          }}
        />
      </div>

      {/* Fixed Overlay (middle layer) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.68)",
          zIndex: 2,
        }}
      ></div>

      {/* Scrollable White Content (top layer) */}
      <motion.div
        initial={{ y: 100, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          width: "100%",
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom, rgb(223, 244, 248), rgb(234, 243, 248), rgb(255, 255, 255), rgb(255, 255, 255), rgb(255, 255, 255))",
          borderRadius: "9rem 9rem 0 0",
          boxShadow: "0px -20px 30px rgba(0, 0, 0, 0.3)",
          zIndex: 3,
          marginTop: "55vh",
          paddingTop: "3rem",
          animation: "moveUp 0.5s ease-out",
        }}
      >
        <div
          style={{
            padding: "0rem 1.5rem 5rem 1.5rem",
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "120rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "2rem 0",
              marginTop: "2rem",
            }}
          >
            <Welcome />
            <div
              style={{
                marginTop: "-10rem",
                marginBottom: "0rem",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Username birthday={birthday} />
            </div>

            {/* Inbox for birthday messages */}
            {birthday && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "5rem",
                  marginBottom: "5rem",
                }}
              >
                <Inbox />
              </div>
            )}

            {/* Message component */}
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "5rem",
              }}
            >
              <Message birthday={birthday} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inline CSS for animation */}
      <style jsx="true">{`
        @keyframes moveUp {
          from {
            transform: translateY(12%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;

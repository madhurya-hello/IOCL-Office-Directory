import React, { useState, useRef } from "react";
import bgVideo from "../assets/indian-oil-video.mp4"; // Background video
import { useNavigate } from "react-router-dom"; // Hook for navigation
import LogoHeader from "../components/shared/LogoHeader"; // Logo component
import LoginCard from "../components/login/LoginCard"; // Login form component

// Login component for user authentication
function Login() {
  // State for spotlight effect position and visibility
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null); // Reference to container for mouse tracking

  const navigate = useNavigate(); // Navigation hook

  // State for login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle login button click
  const handleButtonClick = () => {
    try {
      setError("");
      setLoading(true);

      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      // Note: No actual authentication logic is implemented here
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update spotlight position on mouse move
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsVisible(true);
    }
  };

  // Hide spotlight on mouse leave
  const handleMouseLeave = () => setIsVisible(false);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.45)",
          filter: "brightness(0.9) blur(1px)",
          zIndex: -1,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Spotlight */}
      <div
        style={{
          pointerEvents: "none",
          position: "absolute",
          zIndex: 10,
          borderRadius: "50%",
          transition: "opacity 0.3s ease",
          width: "350px",
          height: "350px",
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
          background:
            "radial-gradient(circle closest-side, rgba(251, 247, 247, 0.18) 0%, rgba(255,255,255,0) 70%)",
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 3,
        }}
      ></div>

      {/* Header */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0.5rem",
          backgroundColor: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(8px)",
          color: "white",
          height: "100px",
          zIndex: 10,
        }}
      >
        <LogoHeader />
      </header>

      {/* Login Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <LoginCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          error={error}
          loading={loading}
          handleButtonClick={handleButtonClick}
        />
      </div>
    </div>
  );
}

export default Login;

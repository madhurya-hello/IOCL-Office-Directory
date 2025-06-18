import React, { useState, useEffect } from "react";

const Username = () => {
  const [displayName, setDisplayName] = useState("Guest");

  // Function to update displayName from localStorage
  const updateDisplayName = () => {
    const currentUser = JSON.parse(localStorage.getItem('authState'));
    setDisplayName(currentUser?.name || "Guest");
  };

  // Initialize displayName and set up storage event listener
  useEffect(() => {
    // Initial update
    updateDisplayName();

    // Add event listener for storage changes
    const handleStorageChange = () => {
      updateDisplayName();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  
  const styles = {
    global: {
      marginTop: "4rem",
      padding: "5em",
      color: "rgb(10, 10, 10)",
      fontFamily: "'Karla', monospace",
      marginBottom: "-10rem",
    },
    cursor: {
      position: "relative",
      width: "24em",
      margin: "-18rem 0 0rem 0",
      borderRight: "2px solid rgb(0, 0, 0)",
      fontSize: "60px",
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
      transform: "translateY(-50%)",
    },
    typewriterAnimation: {
      animation: 
        "typewriter 1s steps(50) 1.5s 1 normal both, " +
        "blinkingCursor 1000ms steps(50) infinite normal",
    },
    keyframes: `
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
      @keyframes blinkingCursor {
        from { border-right-color: transparent; }
        to { border-right-color: transparent; }
      }
    `
  };

  return (
    <div style={styles.global}>
      <style>{styles.keyframes}</style>
      <p 
        className="cursor typewriter-animation" 
        style={{ ...styles.cursor, ...styles.typewriterAnimation }}
      >
        {displayName}
      </p>
    </div>
  );
};

export default Username;
import React from "react";
import gifLogo from "../../assets/indianimage.png";

const LogoHeader = () => (
  <div style={{ 
    display: "flex", 
    alignItems: "center",
    pointerEvents: "none" 
  }}>
    <img
      src={gifLogo}
      alt="Logo"
      style={{ height: "100px", width: "100px" }}
    />
    <div style={{
        height: "80px",
        width: "1px",
        backgroundColor: "white",
        margin: "0 1rem",
      }}
    />
    <div style={{ 
        marginLeft: "1rem", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        fontFamily: "sans-serif"
      }}
    >
      <h1 style={{ 
          margin: 0, 
          fontSize: "1.5rem",
          fontWeight: "bold", 
          lineHeight: 1.2
        }}
      >
        IndianOil
      </h1>
      <p style={{
          margin: 0,
          fontSize: "1rem",
          fontStyle: "italic",
          fontWeight: "500",
          lineHeight: 1.2
        }}
      >
        The Energy of India
      </p>
    </div>
  </div>
);

export default LogoHeader;
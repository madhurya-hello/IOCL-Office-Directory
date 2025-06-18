import PropTypes from "prop-types"; // Library for type checking props
import QRCode from "react-qr-code"; // Library for generating QR codes

// Component for rendering a QR code with a logo
const QrCode = ({
  value, // Data encoded in the QR code (e.g., vCard)
  name = "Tostra Skyer", // Employee name
  subtitle = "FINEST GUIDE", // Employee designation
  tagline = "FOOD", // Employee division or tagline
  indianOilLogo, // Indian Oil logo image source
  image, // Additional image (unused)
}) => {
  // Copy QR code value to clipboard
  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  // Share QR code value via native share API or fallback to copy
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${name}'s Profile`,
          text: `Check out ${name}'s profile`,
          url: value,
        });
      } else {
        handleCopyLink();
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div style={styles.container}>
      {/* QR Code with Logo */}
      <div style={styles.qrWrapper}>
        <QRCode
          value={value}
          size={290}
          bgColor="#ffffff"
          fgColor="rgb(0, 0, 0)"
          level="H" // High error correction level
          style={styles.qrCode}
        />
        <div style={styles.logoOverlay}>
          <img
            src={indianOilLogo}
            alt="Indian Oil Logo"
            style={styles.logoImage}
          />
        </div>
      </div>
    </div>
  );
};

// Inline styles for the component
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "10em",
    maxWidth: "320px",
    margin: "0 auto",
  },
  qrWrapper: {
    position: "relative",
    backgroundColor: "#f8f9fa",
    borderRadius: "0rem",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)",
  },
  qrCode: {
    padding: "4px",
    backgroundColor: "white",
  },
  logoOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "4.5rem",
    height: "4.5rem",
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: "50%",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
};

// Prop type validation
QrCode.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string,
  subtitle: PropTypes.string,
  tagline: PropTypes.string,
  indianOilLogo: PropTypes.string,
  image: PropTypes.string,
};

export default QrCode;

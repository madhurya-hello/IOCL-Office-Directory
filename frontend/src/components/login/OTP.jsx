import React, { useState, useEffect } from "react";

// Component for OTP verification during authentication flow
function OTP({
  email,
  empId,
  onBackToLogin,
  onResendCode,
  actionType,
  onVerify,
}) {
  // OTP input state (6 digits)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(""); // Error message
  const [timeLeft, setTimeLeft] = useState(300); // OTP expiration timer (5 minutes)
  const [otpExpired, setOtpExpired] = useState(false); // OTP expiration flag
  const [isVerifying, SetIsVerifying] = useState(false); // Verification loading state

  // Handles OTP expiration timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setOtpExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handles individual OTP digit input
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  // Handles keyboard navigation between OTP inputs
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    } else if (e.key === "Enter") {
      if (otp.every((digit) => digit)) {
        handleVerify();
      }
    }
  };

  // Verifies OTP with backend
  const handleVerify = async () => {
    SetIsVerifying(true);

    const enteredOTP = otp.join("");
    // Validate all digits entered
    if (otp.some((digit) => !digit)) {
      setError("Please enter the complete OTP");
      return;
    }

    try {
      // API call to verify OTP
      const response = await fetch(
        "http://localhost:8080/api/employees/verifyOTP",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            empId: empId,
            otp: enteredOTP,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        SetIsVerifying(false);
        throw new Error(data.error || "OTP verification failed");
      }

      SetIsVerifying(false);
      setError("");
      onVerify();
    } catch (error) {
      setError(error.message || "OTP verification failed. Please try again.");

      setOtp(["", "", "", "", "", ""]);

      document.getElementById("otp-input-0")?.focus();
    }
  };
  // Checks if OTP is complete
  const isOtpComplete = otp.every((digit) => digit);

  return (
    /* JSX for OTP verification form */
    <>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.3rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        Verify Your Email Address
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "rgba(255, 255, 255, 0.7)",
          marginBottom: "2rem",
          fontSize: "0.95rem",
        }}
      >
        We've sent a verification code to your email address. Please enter the
        6-digit code below.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength="1"
            value={otp[index]}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              width: "3.5rem",
              height: "3.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
              backgroundColor: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "0.5rem",
              color: "white",
              outline: isOtpComplete ? "2px solid #2ecc71" : "none", // green highlight if complete
              transition: "outline 0.2s ease",
            }}
          />
        ))}
      </div>

      {error && (
        <div
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "1rem",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{ textAlign: "center", marginBottom: "1rem", color: "white" }}
      >
        {!otpExpired ? (
          <span>
            Code expires in:{" "}
            <strong>
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")}
              :{(timeLeft % 60).toString().padStart(2, "0")}
            </strong>
          </span>
        ) : (
          <span style={{ color: "red", fontWeight: "bold" }}>
            OTP has expired. Please resend the code.
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={!isOtpComplete}
        style={{
          marginTop: "1rem",
          width: "100%",
          padding: "0.75rem 0",
          backgroundColor: isOtpComplete ? "white" : "gray",
          color: isOtpComplete ? "black" : "#ccc",
          fontWeight: "bold",
          borderRadius: "9999px",
          fontSize: "1.15rem",
          cursor: isOtpComplete ? "pointer" : "not-allowed",
          transition: "transform 0.3s ease, background-color 0.3s ease",
        }}
        onMouseEnter={(e) => {
          if (isOtpComplete) {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.backgroundColor = "#e5e5e5";
          }
        }}
        onMouseLeave={(e) => {
          if (isOtpComplete) {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "white";
          }
        }}
      >
        {isVerifying ? "Verifying..." : "Verify Email"}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          color: "rgba(255, 255, 255, 0.7)",
          fontSize: "0.9rem",
        }}
      >
        <span>Want to Change Your Email Address? </span>
        <a
          href="#"
          style={{ color: "white", fontWeight: "bold", textDecoration: "none" }}
          onClick={(e) => {
            e.preventDefault();
            onBackToLogin();
          }}
        >
          Change Here
        </a>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <a
          href="#"
          style={{
            color: otpExpired ? "#2ecc71" : "white",
            fontWeight: "bold",
            textDecoration: "none",
            fontSize: "0.95rem",
            pointerEvents: otpExpired ? "auto" : "none",
            opacity: otpExpired ? 1 : 0.5,
            cursor: otpExpired ? "pointer" : "not-allowed",
          }}
          onClick={(e) => {
            e.preventDefault();
            if (!otpExpired) return;

            onResendCode();
            setTimeLeft(300);
            setOtpExpired(false);
            setOtp(["", "", "", "", "", ""]);
          }}
        >
          Resend Code
        </a>
      </div>
    </>
  );
}

export default OTP;



const Welcome = () => {
  // Animation style for each letter
  const waveStyle = {
    display: "inline-block",
    animation: "wave 0.9s ease-in-out ",
  };

  return (
    <div
      style={{
        /* Main container styles */
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
        width: "100%",
        color: "#3A8DDC",
        fontFamily: "Lilita One, sans-serif",
      }}
    >
      <h1
        style={{
          /* Main heading styles */
          fontSize: "10rem",
          letterSpacing: "0.5rem",
          marginBottom: "18rem",
          fontWeight: "400",
          fontFamily: "Lilita One, sans-serif",
        }}
      >
        {/* Each letter with staggered animation */}
        <span style={{ ...waveStyle, animationDelay: "0s" }}>W</span>
        <span style={{ ...waveStyle, animationDelay: "0.15s" }}>E</span>
        <span style={{ ...waveStyle, animationDelay: "0.3s" }}>L</span>
        <span style={{ ...waveStyle, animationDelay: "0.45s" }}>C</span>
        <span style={{ ...waveStyle, animationDelay: "0.6s" }}>O</span>
        <span style={{ ...waveStyle, animationDelay: "0.75s" }}>M</span>
        <span style={{ ...waveStyle, animationDelay: "0.9s" }}>E</span>
      </h1>

      {/* CSS animation definition */}
      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
};

export default Welcome;

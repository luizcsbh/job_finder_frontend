const Spinner = ({ size = "20px", color = "currentColor" }) => {
  return (
    <div className="spinner" style={{
      width: size,
      height: size,
      border: `2px solid ${color}33`,
      borderTop: `2px solid ${color}`,
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
      display: "inline-block"
    }} />
  );
};

export default Spinner;

import Spinner from "./Spinner";

const Button = ({ children, loading, disabled, style, onClick, className, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: (disabled || loading) ? "not-allowed" : "pointer",
        transition: "0.3s",
        ...style
      }}
      {...props}
    >
      {loading && <Spinner size="18px" />}
      {children}
    </button>
  );
};

export default Button;

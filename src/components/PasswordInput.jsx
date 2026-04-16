import { useState } from "react";

const PasswordInput = ({ value, onChange, placeholder, style, inputStyle, toggleButtonStyle, onPaste, onCopy }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", ...style }}>
      <input
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        onPaste={onPaste}
        onCopy={onCopy}
        style={{
          width: "100%",
          padding: "12px",
          paddingRight: "45px",
          borderRadius: "8px",
          border: "1px solid #334155",
          background: "#0f172a",
          color: "#fff",
          outline: "none",
          ...inputStyle
        }}
      />
      <button
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "12px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "#94a3b8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s",
          ...toggleButtonStyle
        }}
        type="button"
      >
        {showPassword ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 2.56-4.6M8.06 8.06A10.12 10.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;

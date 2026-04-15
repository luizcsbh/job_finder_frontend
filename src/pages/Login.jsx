import { useState } from "react";
import { api } from "../services/api";

export default function Login({ setToken, goToRegister, goToForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Credenciais inválidas";
      setError(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Bem-vindo de volta</h2>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>E-mail</label>
            <input
                placeholder="seu@email.com"
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
        </div>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>Senha</label>
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Sua senha"
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.passwordInput}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={styles.toggleBtn}
                  type="button"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 2.56-4.6M8.06 8.06A10.12 10.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
            </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleLogin} style={styles.button}>
          Entrar no Sistema
        </button>

        <div style={{ marginTop: "25px", textAlign: "center", fontSize: "14px" }}>
            <p>
              Não tem conta?{" "}
              <span onClick={goToRegister} style={styles.link}>
                Criar conta agora
              </span>
            </p>
            <p style={{ marginTop: "10px" }}>
              <span onClick={goToForgotPassword} style={styles.link}>
                Esqueci minha senha
              </span>
            </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },
  card: {
    background: "#1e293b",
    padding: "40px",
    borderRadius: "16px",
    width: "350px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  inputGroup: {
    marginBottom: "15px"
  },
  label: {
    display: "block",
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "5px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    outline: "none"
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  passwordInput: {
    width: "100%",
    padding: "12px",
    paddingRight: "45px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    outline: "none"
  },
  toggleBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#22c55e",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },
  error: {
    color: "#ef4444",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "15px"
  },
  link: {
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: "600"
  }
};
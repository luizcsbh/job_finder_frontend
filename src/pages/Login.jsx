import { useState } from "react";
import { api } from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function Login({ setToken, goToRegister, goToForgotPassword }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
            <PasswordInput
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
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
import { useState } from "react";
import { api } from "../services/api";
import Button from "../components/Button";

export default function ForgotPassword({ goToLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setMessage("Por favor, informe seu e-mail.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      await api.post("/forgot-password", { email });
      setMessage("Link de recuperação enviado! Verifique seu e-mail.");
      setIsError(false);
    } catch (error) {
      setMessage(err.response?.data?.detail || "Erro ao solicitar recuperação.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Recuperar Senha</h2>
        <p style={styles.text}>
          Informe o e-mail associado à sua conta. Se ele existir em nossa base, enviaremos um link seguro via Supabase para você alterar a sua senha.
        </p>

        <div style={{ marginBottom: "20px" }}>
            <label style={styles.label}>E-mail da Conta</label>
            <input
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
        </div>

        {message && (
          <p style={{ ...styles.message, color: isError ? "#ef4444" : "#22c55e" }}>
            {message}
          </p>
        )}

        <Button 
          onClick={handleReset} 
          disabled={loading || !email}
          loading={loading}
          style={{
            ...styles.button,
            opacity: (!loading && email) ? 1 : 0.6,
            cursor: (!loading && email) ? "pointer" : "not-allowed"
          }}
        >
          Enviar Link de Recuperação
        </Button>

        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px" }}>
          Lembrou a senha?{" "}
          <span onClick={goToLogin} style={styles.link}>
            Voltar para Login
          </span>
        </p>
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
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
  },
  text: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "20px",
    lineHeight: 1.5,
    textAlign: "center"
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
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    transition: "0.3s"
  },
  message: {
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "15px"
  },
  link: {
    color: "#38bdf8",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

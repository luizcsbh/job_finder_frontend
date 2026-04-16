import { useState, useMemo } from "react";
import { api } from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Password validation logic
  const requirements = useMemo(() => [
    { label: "Mínimo de 8 caracteres", met: password.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", met: /[A-Z]/.test(password) },
    { label: "Pelo menos um número", met: /[0-9]/.test(password) },
    { label: "Pelo menos um caractere especial (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: "As senhas devem coincidir", met: password === confirmPassword && password.length > 0 },
  ], [password, confirmPassword]);

  const isPasswordValid = requirements.every(req => req.met);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  const handleRegister = async () => {
    if (!isPasswordValid) {
        setMessage("A senha não atende a todos os requisitos.");
        return;
    }
    if (!doPasswordsMatch) {
        setMessage("As senhas não coincidem.");
        return;
    }

    try {
      await api.post("/register", { email, password, name });
      
      setMessage("Conta criada com sucesso!");
      setTimeout(() => {
        goToLogin();
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao criar conta";
      setMessage(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Criar Nova Conta</h2>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>Nome Completo</label>
            <input
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            />
        </div>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>E-mail</label>
            <input
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            />
        </div>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>Senha</label>
            <PasswordInput
                placeholder="Crie uma senha forte"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>Confirmar Senha</label>
            <PasswordInput
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
            />
        </div>

        {/* Password Checklist */}
        <div style={styles.checklist}>
            {requirements.map((req, i) => (
                <div key={i} style={{ 
                    ...styles.checkItem, 
                    color: req.met ? "#22c55e" : "#ef4444" 
                }}>
                    <span style={styles.icon}>{req.met ? "✓" : "×"}</span>
                    {req.label}
                </div>
            ))}
        </div>

        {message && (
            <p style={{ 
                ...styles.message, 
                color: message.includes("sucesso") ? "#22c55e" : "#ef4444" 
            }}>
                {message}
            </p>
        )}

        <button 
            onClick={handleRegister} 
            disabled={!isPasswordValid || !email || !name || !doPasswordsMatch}
            style={{ 
                ...styles.button, 
                opacity: (isPasswordValid && email && name && doPasswordsMatch) ? 1 : 0.5,
                cursor: (isPasswordValid && email && name && doPasswordsMatch) ? "pointer" : "not-allowed"
            }}
        >
          Finalizar Cadastro
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px" }}>
          Já tem conta?{" "}
          <span onClick={goToLogin} style={styles.link}>
            Fazer login
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
    padding: "40px",
    borderRadius: "16px",
    width: "360px",
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

  checklist: {
    margin: "15px 0",
    fontSize: "12px"
  },
  checkItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
    transition: "color 0.3s"
  },
  icon: {
    fontWeight: "bold",
    marginRight: "8px",
    width: "15px"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "8px",
    color: "#0f172a",
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
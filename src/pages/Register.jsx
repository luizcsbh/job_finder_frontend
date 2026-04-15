import { useState, useMemo } from "react";
import { api } from "../services/api";

export default function Register({ goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Crie uma senha forte"
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

        <div style={styles.inputGroup}>
            <label style={{...styles.label, textAlign: "left"}}>Confirmar Senha</label>
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Digite a senha novamente"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
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
    justifyContent: "center",
    transition: "color 0.2s"
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
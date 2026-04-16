import { useState, useMemo } from "react";
import { api } from "../services/api";
import PasswordInput from "../components/PasswordInput";

export default function ResetPasswordWithToken({ recoveryToken, goToLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwRequirements = useMemo(() => [
    { label: "Mínimo de 8 caracteres", met: newPassword.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", met: /[A-Z]/.test(newPassword) },
    { label: "Pelo menos um número", met: /[0-9]/.test(newPassword) },
    { label: "Pelo menos um caractere especial (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: "As senhas devem coincidir", met: newPassword === confirmPassword && newPassword.length > 0 },
  ], [newPassword, confirmPassword]);

  const isPasswordValid = pwRequirements.every(req => req.met);
  const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const handleUpdate = async () => {
    if (!isPasswordValid || !doPasswordsMatch) {
      setMessage("A nova senha não atende a todos os requisitos.");
      setIsError(true);
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/reset-password-with-token", {
        token: recoveryToken,
        new_password: newPassword
      });
      setMessage("Senha redefinida com sucesso! Você já pode fazer login.");
      setIsError(false);
      setTimeout(() => {
        goToLogin();
      }, 3000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Erro ao redefinir a senha. O link pode estar expirado.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Redefinir Senha</h2>
        <p style={{ textAlign: "center", fontSize: "14px", color: "#94a3b8", marginBottom: "20px" }}>
          Sua identidade foi verificada. Crie uma nova senha segura.
        </p>

        <div style={styles.inputGroup}>
            <label style={styles.label}>Nova Senha</label>
            <PasswordInput
                placeholder="Crie uma nova senha forte"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                toggleButtonStyle={{ fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}
            />
        </div>

        <div style={styles.inputGroup}>
            <label style={styles.label}>Confirmar Nova Senha</label>
            <PasswordInput
                placeholder="Digite a nova senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                toggleButtonStyle={{ fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}
            />
        </div>

        <div style={styles.checklist}>
            {pwRequirements.map((req, i) => (
                <div key={i} style={{ ...styles.checkItem, color: req.met ? "#22c55e" : "#ef4444" }}>
                    <span style={styles.icon}>{req.met ? "✓" : "×"}</span>
                    {req.label}
                </div>
            ))}
        </div>

        {message && (
            <p style={{ ...styles.message, color: isError ? "#ef4444" : "#22c55e" }}>
                {message}
            </p>
        )}

        <button 
            onClick={handleUpdate} 
            disabled={loading || !isPasswordValid || !doPasswordsMatch}
            style={{ 
                ...styles.button, 
                opacity: (!loading && isPasswordValid && doPasswordsMatch) ? 1 : 0.5,
                cursor: (!loading && isPasswordValid && doPasswordsMatch) ? "pointer" : "not-allowed"
            }}
        >
          {loading ? "Redefinindo..." : "Salvar e Continuar"}
        </button>

        <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px" }}>
          Lembrou a senha da forma divina?{" "}
          <span onClick={goToLogin} style={styles.link}>
            Voltar para Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#0f172a" },
  card: { background: "#1e293b", padding: "40px", borderRadius: "16px", width: "360px", color: "#fff", boxShadow: "0 10px 25px rgba(0,0,0,0.3)" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", fontSize: "12px", color: "#94a3b8", marginBottom: "5px" },

  checklist: { margin: "15px 0", fontSize: "12px" },
  checkItem: { display: "flex", alignItems: "center", marginBottom: "5px", transition: "color 0.3s" },
  icon: { fontWeight: "bold", marginRight: "8px", width: "15px" },
  button: { width: "100%", padding: "14px", background: "#38bdf8", border: "none", borderRadius: "8px", color: "#0f172a", fontWeight: "bold", fontSize: "16px", transition: "0.3s" },
  message: { fontSize: "14px", textAlign: "center", marginBottom: "15px" },
  link: { color: "#38bdf8", cursor: "pointer", fontWeight: "bold" }
};

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';

export default function Profile({ userProfile, setUserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: ''
  });

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwMessage, setPwMessage] = useState("");

  const pwRequirements = useMemo(() => [
    { label: "Mínimo de 8 caracteres", met: newPassword.length >= 8 },
    { label: "Pelo menos uma letra maiúscula", met: /[A-Z]/.test(newPassword) },
    { label: "Pelo menos um número", met: /[0-9]/.test(newPassword) },
    { label: "Pelo menos um caractere especial (!@#$%^&*)", met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) },
    { label: "As senhas devem coincidir", met: newPassword === confirmPassword && newPassword.length > 0 },
  ], [newPassword, confirmPassword]);

  const isPasswordValid = pwRequirements.every(req => req.met);
  const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        birthDate: userProfile.birthDate || ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    try {
      await api.put('/profile', { 
        name: formData.name, 
        birth_date: formData.birthDate 
      });

      // Update initials
      const parts = formData.name.trim().split(" ");
      let initials = parts[0] ? parts[0].charAt(0).toUpperCase() : 'U';
      if (parts.length > 1) {
        initials += parts[parts.length - 1].charAt(0).toUpperCase();
      }

      setUserProfile({
        ...userProfile,
        name: formData.name,
        birthDate: formData.birthDate,
        initials: initials
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar perfil", err);
      // Optional: add UI error toast or message here in the future
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setPwMessage("A senha atual é obrigatória.");
      return;
    }
    if (!isPasswordValid || !doPasswordsMatch) {
      setPwMessage("A nova senha não atende a todos os requisitos.");
      return;
    }
    
    try {
      await api.post('/reset-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPwMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setTimeout(() => setPwMessage(""), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao alterar a senha";
      setPwMessage(errorMsg);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Perfil</h1>
      
      <div style={styles.card}>
        <div style={styles.avatarPlaceholder}>
          {userProfile?.initials || 'U'}
        </div>
        
        <div style={styles.infoGroup}>
          <label style={styles.label}>Nome Completo</label>
          {isEditing ? (
            <input 
              style={styles.input} 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              placeholder="Seu nome completo"
            />
          ) : (
            <div style={styles.value}>{formData.name || 'Não informado'}</div>
          )}
        </div>
        
        <div style={styles.infoGroup}>
          <label style={styles.label}>E-mail (Não pode ser alterado)</label>
          <input 
            style={{...styles.input, ...styles.disabledInput}} 
            value={formData.email} 
            disabled 
          />
        </div>

        <div style={styles.infoGroup}>
          <label style={styles.label}>Data de Nascimento</label>
          {isEditing ? (
            <input 
              type="date"
              style={styles.input} 
              value={formData.birthDate} 
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})} 
            />
          ) : (
            <div style={styles.value}>
              {formData.birthDate 
                ? formData.birthDate.split('-').reverse().join('/') 
                : 'Não informada'}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div style={styles.actionButtons}>
            <button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancelar</button>
            <button style={styles.saveBtn} onClick={handleSave}>Salvar Alterações</button>
          </div>
        ) : (
          <button style={styles.editBtn} onClick={() => setIsEditing(true)}>Editar Perfil</button>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: "22px", marginBottom: "20px", width: "100%", alignSelf: "flex-start" }}>Alterar Senha</h2>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Senha Atual</label>
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Digite sua senha atual"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={styles.passwordInput}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={styles.toggleBtn} type="button">
                   {showPassword ? (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                   ) : (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 2.56-4.6M8.06 8.06A10.12 10.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                   )}
                </button>
            </div>
        </div>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Nova Senha</label>
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Crie uma nova senha forte"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.passwordInput}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={styles.toggleBtn} type="button">
                   {showPassword ? (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                   ) : (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 2.56-4.6M8.06 8.06A10.12 10.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                   )}
                </button>
            </div>
        </div>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Confirmar Nova Senha</label>
            <div style={styles.passwordWrapper}>
                <input
                    placeholder="Digite a nova senha novamente"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    style={styles.passwordInput}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={styles.toggleBtn} type="button">
                   {showPassword ? (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                   ) : (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 2.56-4.6M8.06 8.06A10.12 10.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                   )}
                </button>
            </div>
        </div>

        <div style={styles.checklist}>
            {pwRequirements.map((req, i) => (
                <div key={i} style={{ ...styles.checkItem, color: req.met ? "#22c55e" : "#ef4444" }}>
                    <span style={styles.icon}>{req.met ? "✓" : "×"}</span>
                    {req.label}
                </div>
            ))}
        </div>

        {pwMessage && (
            <p style={{ ...styles.message, color: pwMessage.includes("sucesso") ? "#22c55e" : "#ef4444" }}>
                {pwMessage}
            </p>
        )}

        <button 
            onClick={handleUpdatePassword} 
            disabled={!currentPassword || !isPasswordValid || !doPasswordsMatch}
            style={{ 
                ...styles.updatePwBtn, 
                opacity: (currentPassword && isPasswordValid && doPasswordsMatch) ? 1 : 0.5,
                cursor: (currentPassword && isPasswordValid && doPasswordsMatch) ? "pointer" : "not-allowed"
            }}
        >
          Atualizar Senha
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    color: "#fff",
    maxWidth: "600px"
  },
  title: {
    fontSize: "28px",
    marginBottom: "30px",
    fontWeight: "bold"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #334155",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px"
  },
  avatarPlaceholder: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "#38bdf8",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "40px",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  infoGroup: {
    width: "100%",
    marginBottom: "20px",
    background: "#0f172a",
    padding: "15px",
    borderRadius: "8px"
  },
  label: {
    display: "block",
    color: "#94a3b8",
    fontSize: "14px",
    marginBottom: "8px"
  },
  value: {
    fontSize: "18px",
    fontWeight: "600"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    fontSize: "16px",
    outline: "none"
  },
  disabledInput: {
    background: "#0f172a",
    color: "#64748b",
    cursor: "not-allowed"
  },
  editBtn: {
    padding: "12px 24px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    width: "100%",
    fontSize: "16px"
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    width: "100%",
    marginTop: "10px"
  },
  cancelBtn: {
    padding: "12px",
    background: "#334155",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
    fontSize: "16px"
  },
  saveBtn: {
    padding: "12px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    flex: 1,
    fontSize: "16px"
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  passwordInput: {
    width: "100%",
    padding: "10px",
    paddingRight: "45px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    fontSize: "16px",
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
    margin: "0 0 20px 0",
    fontSize: "13px",
    width: "100%",
    alignSelf: "flex-start"
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
  updatePwBtn: {
    padding: "12px 24px",
    background: "#facc15",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
    width: "100%",
    fontSize: "16px",
    transition: "0.3s"
  },
  message: {
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "15px",
    width: "100%"
  }
};

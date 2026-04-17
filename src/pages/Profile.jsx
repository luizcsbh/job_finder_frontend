import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';

export default function Profile({ userProfile, setUserProfile, handleLogout }) {
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
  const [pwMessage, setPwMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPw, setIsUpdatingPw] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
    setIsSaving(true);
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
    } catch (error) {
      console.error("Erro ao salvar perfil", err);
    } finally {
      setIsSaving(false);
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
    
    setIsUpdatingPw(true);
    try {
      await api.post('/reset-password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPwMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwMessage(""), 3000);
    } catch (error) {
      const errorMsg = err.response?.data?.detail || "Erro ao alterar a senha";
      setPwMessage(errorMsg);
    } finally {
      setIsUpdatingPw(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete("/profile");
      handleLogout();
    } catch (error) {
      console.error("Erro ao excluir conta", err);
      alert("Erro ao excluir conta. Tente novamente.");
    } finally {
      setIsDeleting(false);
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
            <Button style={styles.cancelBtn} onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button 
                style={styles.saveBtn} 
                onClick={handleSave}
                loading={isSaving}
            >
                Salvar Alterações
            </Button>
          </div>
        ) : (
          <Button style={styles.editBtn} onClick={() => setIsEditing(true)}>Editar Perfil</Button>
        )}
      </div>

      <div style={styles.card}>
        <h2 style={{ fontSize: "22px", marginBottom: "20px", width: "100%", alignSelf: "flex-start" }}>Alterar Senha</h2>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Senha Atual</label>
            <PasswordInput
                placeholder="Digite sua senha atual"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                inputStyle={{ background: "#1e293b" }}
            />
        </div>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Nova Senha</label>
            <PasswordInput
                placeholder="Crie uma nova senha forte"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                inputStyle={{ background: "#1e293b" }}
            />
        </div>

        <div style={styles.infoGroup}>
            <label style={styles.label}>Confirmar Nova Senha</label>
            <PasswordInput
                placeholder="Digite a nova senha novamente"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                inputStyle={{ background: "#1e293b" }}
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

        {pwMessage && (
            <p style={{ ...styles.message, color: pwMessage.includes("sucesso") ? "#22c55e" : "#ef4444" }}>
                {pwMessage}
            </p>
        )}

        <Button 
            onClick={handleUpdatePassword} 
            disabled={!currentPassword || !isPasswordValid || !doPasswordsMatch || isUpdatingPw}
            loading={isUpdatingPw}
            style={{ 
                ...styles.updatePwBtn, 
                opacity: (currentPassword && isPasswordValid && doPasswordsMatch && !isUpdatingPw) ? 1 : 0.5,
                cursor: (currentPassword && isPasswordValid && doPasswordsMatch && !isUpdatingPw) ? "pointer" : "not-allowed"
            }}
        >
          Atualizar Senha
        </Button>
      </div>

      <div style={{ ...styles.card, borderColor: "#ef444433", marginTop: "10px" }}>
        <h2 style={{ fontSize: "22px", color: "#ef4444", marginBottom: "15px", width: "100%", alignSelf: "flex-start" }}>Zona de Perigo</h2>
        <p style={{ fontSize: "14px", color: "#94a3b8", marginBottom: "20px", textAlign: "left", width: "100%" }}>
            Uma vez excluída, sua conta, currículo e vagas favoritas serão permanentemente removidos. Esta ação não pode ser desfeita.
        </p>
        
        {!showDeleteConfirm ? (
            <Button 
                onClick={() => setShowDeleteConfirm(true)} 
                style={styles.deleteBtn}
            >
                Excluir Minha Conta
            </Button>
        ) : (
            <div style={{ width: "100%" }}>
                <p style={{ color: "#ef4444", fontWeight: "bold", marginBottom: "15px", fontSize: "14px" }}>
                    Tem certeza absoluta? Digite "EXCLUIR" para confirmar.
                </p>
                <input 
                    placeholder="Digite EXCLUIR" 
                    style={{ ...styles.input, marginBottom: "15px" }}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button 
                        style={styles.cancelBtn} 
                        onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                        }}
                    >
                        Não, manter conta
                    </Button>
                    <Button 
                        style={{ 
                            ...styles.deleteBtn, 
                            opacity: deleteConfirmText === "EXCLUIR" ? 1 : 0.5 
                        }} 
                        onClick={handleDeleteAccount}
                        loading={isDeleting}
                        disabled={deleteConfirmText !== "EXCLUIR"}
                    >
                        Sim, excluir permanentemente
                    </Button>
                </div>
            </div>
        )}
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
  },
  deleteBtn: {
    padding: "12px 24px",
    background: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
    fontSize: "16px",
    transition: "0.3s"
  }
};

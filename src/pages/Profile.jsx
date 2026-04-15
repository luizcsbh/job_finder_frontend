import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Profile({ userProfile, setUserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: ''
  });

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
    alignItems: "center"
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
  }
};

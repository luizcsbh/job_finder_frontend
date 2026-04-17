import { useEffect, useState } from "react";
import { api } from "../services/api";
import Button from "../components/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // overview, users, apis
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, healthRes, usersRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/health"),
        api.get("/admin/users")
      ]);
      setStats(statsRes.data);
      setApiHealth(healthRes.data.apis);
      setUsers(usersRes.data.users);
    } catch (err) {
      console.error("Erro ao carregar dados admin", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    try {
      await api.put(`/admin/users/${userId}`, { is_admin: isAdmin });
      setUsers(users.map(u => u.id === userId ? { ...u, is_admin: isAdmin } : u));
    } catch (err) {
      alert("Erro ao atualizar status de administrador");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário definitivamente?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert("Erro ao excluir usuário");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Carregando painel administrativo...</div>;
  }

  const currentUserEmail = localStorage.getItem("user_email") || "";
  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🛡️ Painel do Administrador</h1>
          <p style={styles.subtitle}>Gerenciamento centralizado do sistema Job Finder Pro</p>
        </div>
        <Button onClick={loadAdminData} style={styles.refreshBtn}>Atualizar Dados</Button>
      </header>

      <div style={styles.tabs}>
        <button onClick={() => setTab("overview")} style={tab === "overview" ? styles.activeTab : styles.tab}>Visão Geral</button>
        <button onClick={() => setTab("users")} style={tab === "users" ? styles.activeTab : styles.tab}>Usuários ({users.length})</button>
        <button onClick={() => setTab("apis")} style={tab === "apis" ? styles.activeTab : styles.tab}>Status das APIs</button>
      </div>

      {tab === "overview" && (
        <div style={styles.grid}>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Usuários Totais</span>
            <span style={styles.statValue}>{stats?.total_users}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Status do Sistema</span>
            <span style={{...styles.statValue, color: "#22c55e"}}>{stats?.system_status}</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statLabel}>Ambiente</span>
            <span style={styles.statValue}>{stats?.environment}</span>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div style={styles.card}>
          <div style={{ padding: "15px", borderBottom: "1px solid #334155" }}>
            <input 
              type="text" 
              placeholder="Pesquisar por nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>E-mail</th>
                <th style={styles.th}>Admin?</th>
                <th style={styles.th}>Data Cadastro</th>
                <th style={styles.th}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name || "---"}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <input 
                      type="checkbox" 
                      checked={u.is_admin} 
                      onChange={(e) => handleToggleAdmin(u.id, e.target.checked)}
                      disabled={u.email === currentUserEmail}
                      title={u.email === currentUserEmail ? "Você não pode remover seu próprio acesso admin" : ""}
                    />
                  </td>
                  <td style={styles.td}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}</td>
                  <td style={styles.td}>
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      style={{...styles.actionBtn, ...styles.deleteBtn}}
                      disabled={u.email === currentUserEmail}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "apis" && apiHealth && (
        <div style={styles.apiGrid}>
          {/* Main System Status Card */}
          <div style={{ ...styles.apiCard, gridColumn: "span 2", border: "1px solid #38bdf844", background: "rgba(56, 189, 248, 0.05)" }}>
            <div style={styles.apiInfo}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ 
                  ...styles.statusDot, 
                  background: apiHealth.system_db?.status === "Active" ? (apiHealth.system_db.latency > 500 ? "#f59e0b" : "#22c55e") : "#ef4444",
                  boxShadow: apiHealth.system_db?.status === "Active" ? (apiHealth.system_db.latency > 500 ? "0 0 12px #f59e0b" : "0 0 12px #22c55e") : "0 0 12px #ef4444"
                }} />
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>STATUS DO SISTEMA PRINCIPAL</span>
              </div>
              <span style={styles.latencyText}>{apiHealth.system_db?.latency}ms</span>
            </div>
            <p style={styles.apiDesc}>Conectividade com Banco de Dados e Serviços Core</p>
          </div>

          {/* Job APIs */}
          {Object.entries(apiHealth).filter(([name]) => name !== "system_db").map(([name, data]) => {
            const isDown = data.status !== "Active";
            const isSlow = data.latency > 800;
            const statusColor = isDown ? "#ef4444" : (isSlow ? "#f59e0b" : "#22c55e");
            
            return (
              <div key={name} style={styles.apiCard}>
                <div style={styles.apiInfo}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ 
                      ...styles.statusDot, 
                      background: statusColor,
                      boxShadow: `0 0 10px ${statusColor}44`
                    }} />
                    <span style={styles.apiName}>{name.toUpperCase()}</span>
                  </div>
                  <span style={styles.latencyText}>{data.latency}ms</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={styles.apiDesc}>Integração via {name.includes("linkedin") ? "Web Scraping" : "API REST"}</p>
                  <span style={{ 
                    fontSize: "10px", 
                    fontWeight: "bold", 
                    padding: "2px 6px", 
                    borderRadius: "4px",
                    background: statusColor + "22",
                    color: statusColor
                  }}>
                    {isDown ? "OFFLINE" : (isSlow ? "LENTO" : "ONLINE")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px", color: "#fff", maxWidth: "1000px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
  title: { fontSize: "28px", margin: 0 },
  subtitle: { color: "#94a3b8", marginTop: "5px" },
  refreshBtn: { background: "#38bdf8", color: "#0f172a", fontWeight: "bold" },
  loading: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#fff", background: "#0f172a" },
  
  tabs: { display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "1px solid #334155", paddingBottom: "10px" },
  tab: { padding: "10px 20px", background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontWeight: "600" },
  activeTab: { padding: "10px 20px", background: "#38bdf822", color: "#38bdf8", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },

  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  statCard: { background: "#1e293b", padding: "25px", borderRadius: "16px", border: "1px solid #334155", display: "flex", flexDirection: "column" },
  statLabel: { fontSize: "14px", color: "#94a3b8", marginBottom: "10px" },
  statValue: { fontSize: "32px", fontWeight: "bold" },

  card: { background: "#1e293b", borderRadius: "16px", border: "1px solid #334155", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "15px", background: "#0f172a", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase" },
  tr: { borderBottom: "1px solid #334155" },
  td: { padding: "15px", fontSize: "14px" },

  apiGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" },
  apiCard: { background: "#1e293b", padding: "20px", borderRadius: "16px", border: "1px solid #334155" },
  apiInfo: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  apiName: { fontWeight: "bold", fontSize: "16px" },
  apiDesc: { fontSize: "12px", color: "#64748b", margin: 0 },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" },
  statusDot: { width: "10px", height: "10px", borderRadius: "50%", transition: "0.3s" },
  latencyText: { fontSize: "12px", color: "#64748b", fontFamily: "monospace" },
  actionBtn: { padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
  deleteBtn: { background: "#ef4444", color: "#fff" },
  searchInput: {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "#fff",
    outline: "none",
    fontSize: "14px"
  }
};

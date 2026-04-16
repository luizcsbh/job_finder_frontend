import { useEffect, useState } from "react";
import { api } from "../services/api";
import Button from "../components/Button";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview"); // overview, users, apis

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

  if (loading) {
    return <div style={styles.loading}>Carregando painel administrativo...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
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
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>E-mail</th>
                <th style={styles.th}>Data Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.id}</td>
                  <td style={styles.td}>{u.name || "---"}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "apis" && (
        <div style={styles.apiGrid}>
          {apiHealth && Object.entries(apiHealth).map(([name, status]) => (
            <div key={name} style={styles.apiCard}>
              <div style={styles.apiInfo}>
                <span style={styles.apiName}>{name.toUpperCase()}</span>
                <span style={{ 
                  ...styles.statusBadge, 
                  background: status === "Active" ? "#22c55e22" : "#ef444422",
                  color: status === "Active" ? "#22c55e" : "#ef4444" 
                }}>
                  {status}
                </span>
              </div>
              <p style={styles.apiDesc}>Integração via {name === "linkedin" ? "Scraping" : "API REST"}</p>
            </div>
          ))}
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
  apiInfo: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  apiName: { fontWeight: "bold", fontSize: "16px" },
  apiDesc: { fontSize: "12px", color: "#64748b", margin: 0 },
  statusBadge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }
};

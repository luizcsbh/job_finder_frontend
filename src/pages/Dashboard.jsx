import { useEffect, useState } from "react";
import { api } from "../services/api";
import Button from "../components/Button";

export default function Dashboard({ onRefresh }) {
  const [profile, setProfile] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
    } catch (err) {
      console.error("Erro ao carregar perfil", err);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Selecione um arquivo PDF primeiro");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage("Currículo enviado com sucesso!");
      loadProfile(); 
      if (onRefresh) onRefresh();
    } catch (err) {
      setMessage("Erro ao enviar currículo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get("/download-resume", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "curriculo.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage("Erro ao baixar currículo. Verifique se você fez upload.");
    }
  };

  const renderGauge = (value, label, color) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div style={styles.gaugeBox}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} stroke="#0f172a" strokeWidth="8" fill="transparent" />
          <circle 
            cx="50" cy="50" r={radius} 
            stroke={color} strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
          <text x="50" y="55" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">{value}%</text>
        </svg>
        <span style={{ fontSize: "12px", color: "#94a3b8", marginTop: "10px" }}>{label}</span>
      </div>
    );
  };

  return (
    <div style={{ padding: "40px", background: "#0f172a", minHeight: "100vh", color: "#fff" }}>
      <div style={styles.header}>
        <h1>📊 Dashboard de Carreira</h1>
        <p style={{ color: "#94a3b8" }}>Métricas detalhadas e análise de prontidão de mercado.</p>
      </div>

      {/* Grid Superior: Gauges e Status */}
      <div style={{...styles.grid, marginBottom: "30px"}}>
         <div style={{...styles.card, display: "flex", justifyContent: "space-around", alignItems: "center"}}>
            {renderGauge(profile?.analysis?.metrics?.completeness || 0, "Completude", "#38bdf8")}
            {renderGauge(profile?.analysis?.metrics?.readiness || 0, "Prontidão", "#22c55e")}
            <div style={styles.seniorityBadge}>
                <span style={{fontSize: "12px", color: "#94a3b8"}}>Nível Estimado</span>
                <h2 style={{color: "#facc15", margin: "5px 0"}}>{profile?.analysis?.metrics?.seniority || "---"}</h2>
            </div>
         </div>

         <div style={styles.card}>
            <h3>📄 Gerenciar Currículo</h3>
            <input type="file" accept=".pdf" onChange={handleFileChange} style={styles.fileInput} />
            <Button 
                onClick={handleUpload} 
                disabled={loading} 
                style={styles.uploadBtn}
                loading={loading}
            >
                {profile?.has_resume ? "Atualizar Currículo" : "Enviar Currículo"}
            </Button>

            {profile?.has_resume && (
              <Button onClick={handleDownload} style={styles.downloadBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: "8px"}}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Baixar Meu Currículo
              </Button>
            )}

            {message && (
              <p style={{ marginTop: "10px", fontSize: "13px", color: message.includes("sucesso") ? "#22c55e" : "#ef4444" }}>
                {message}
              </p>
            )}

            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "15px" }}>
                Foco Detectado: <strong style={{color: "#38bdf8"}}>{profile?.analysis?.focus || "N/A"}</strong>
            </p>
         </div>
      </div>

      <div style={styles.grid}>
        {/* Nuvem de Palavras */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3>☁️ Nuvem de Talentos</h3>
            <span style={styles.countBadge}>{profile?.analysis?.keywords?.length || 0} termos</span>
          </div>
          <div style={styles.wordCloud}>
            {profile?.analysis?.keywords?.map((word, i) => (
              <span key={i} style={{
                fontSize: `${((word.length * 2 + i) % 12) + 14}px`,
                color: ["#38bdf8", "#22c55e", "#facc15", "#a855f7", "#fb923c"][i % 5],
                margin: "6px",
                display: "inline-block",
                fontWeight: "bold",
                opacity: 0.85
              }}>{word}</span>
            ))}
          </div>
        </div>

        {/* Distribuição de Stacks */}
        <div style={styles.card}>
          <h3>🛠️ Distribuição de Stacks</h3>
          <div style={styles.stacksContainer}>
            {Object.entries(profile?.analysis?.skills || {}).map(([category, skills]) => (
              <div key={category} style={styles.skillRow}>
                <div style={styles.skillInfo}>
                  <span style={styles.categoryName}>{category}</span>
                  <span style={styles.skillCount}>{skills.length} itens</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${Math.min(skills.length * 20, 100)}%`,
                    background: category === "Frontend" ? "#38bdf8" : 
                                category === "Backend" ? "#22c55e" : 
                                category === "Database" ? "#facc15" : "#a855f7"
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backBtn: { padding: "10px 20px", background: "#1e293b", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", marginBottom: "20px" },
  header: { marginBottom: "40px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" },
  card: { background: "#1e293b", padding: "30px", borderRadius: "20px", border: "1px solid #334155" },
  gaugeBox: { display: "flex", flexDirection: "column", alignItems: "center" },
  seniorityBadge: { textAlign: "center", borderLeft: "2px solid #334155", paddingLeft: "30px" },
  fileInput: { margin: "15px 0", display: "block" },
  uploadBtn: { width: "100%", padding: "12px", background: "#38bdf8", color: "#0f172a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" },
  downloadBtn: { width: "100%", marginTop: "10px", padding: "12px", background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" },
  countBadge: { fontSize: "12px", background: "#38bdf822", color: "#38bdf8", padding: "4px 8px", borderRadius: "20px" },
  wordCloud: { display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", minHeight: "150px", background: "#0f172a", padding: "20px", borderRadius: "12px" },
  stacksContainer: { marginTop: "15px" },
  skillRow: { marginBottom: "15px" },
  skillInfo: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  categoryName: { fontWeight: "bold", fontSize: "14px" },
  skillCount: { color: "#94a3b8", fontSize: "12px" },
  barBg: { background: "#0f172a", height: "8px", borderRadius: "4px", overflow: "hidden" },
  barFill: { height: "100%", borderRadius: "4px", transition: "width 1s ease-in-out" }
};

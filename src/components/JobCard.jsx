import { useState } from "react";
import { api } from "../services/api";

export default function JobCard({ job, isFavorite, onFavoriteToggle }) {
  const [toggling, setToggling] = useState(false);

  const toggleFavorite = async () => {
    setToggling(true);
    try {
      await api.post("/favorites", { job_url: job.url });
      onFavoriteToggle();
    } catch (err) {
      console.error("Erro ao favoritar", err);
    } finally {
      setToggling(false);
    }
  };

  // ATS score = ai_score (resume-vs-job similarity), capped at 100
  const atsScore = Math.min(Math.round(job.ai_score || 0), 100);

  const getAtsColor = (score) => {
    if (score >= 70) return "#22c55e"; // green
    if (score >= 40) return "#facc15"; // yellow
    return "#ef4444";                  // red
  };

  const atsColor = getAtsColor(atsScore);

  const sourceColors = {
    LinkedIn:    "#0a66c2",
    Remotive:    "#6366f1",
    ArbeitNow:   "#0891b2",
    "The Muse":  "#db2777",
    JobIceCream: "#f97316",
    Adzuna:      "#16a34a",
    Jooble:      "#7c3aed",
  };
  const badgeColor = sourceColors[job.source] || "#3b3bb9";

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{job.title}</h3>
        <button
          onClick={toggleFavorite}
          disabled={toggling}
          style={{ ...styles.favBtn, color: isFavorite ? "#ef4444" : "#94a3b8" }}
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <p style={styles.company}>{job.company}</p>

      {/* Source tag */}
      <span style={{ ...styles.sourceTag, background: badgeColor }}>{job.source}</span>

      {/* ATS Score — prominent */}
      <div style={styles.atsBlock}>
        <div style={styles.atsLabelRow}>
          <span style={styles.atsLabel}>ATS Score</span>
          <span style={{ ...styles.atsPct, color: atsColor }}>{atsScore}%</span>
        </div>
        <div style={styles.atsBarBg}>
          <div style={{
            ...styles.atsBarFill,
            width: `${atsScore}%`,
            background: atsColor
          }} />
        </div>
        <span style={{ ...styles.atsHint, color: atsColor }}>
          {atsScore >= 70 ? "✓ Ótima compatibilidade" :
           atsScore >= 40 ? "~ Compatibilidade moderada" :
           "✗ Baixa compatibilidade"}
        </span>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.score}>⭐ {job.score} pts</span>
        <a href={job.url} target="_blank" rel="noreferrer" style={styles.link}>
          Ver vaga →
        </a>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #334155",
    transition: "transform 0.2s, border-color 0.2s"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  title: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.4",
    flex: 1,
    paddingRight: "10px"
  },
  favBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    flexShrink: 0
  },
  company: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "13px"
  },
  sourceTag: {
    background: "#3b3bb9",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "bold",
    alignSelf: "flex-start"
  },
  atsBlock: {
    background: "#0f172a",
    borderRadius: "10px",
    padding: "12px",
    marginTop: "4px"
  },
  atsLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  atsLabel: {
    fontSize: "12px",
    color: "#94a3b8",
    fontWeight: "600",
    letterSpacing: "0.05em",
    textTransform: "uppercase"
  },
  atsPct: {
    fontSize: "20px",
    fontWeight: "bold"
  },
  atsBarBg: {
    background: "#1e293b",
    height: "6px",
    borderRadius: "3px",
    overflow: "hidden",
    marginBottom: "6px"
  },
  atsBarFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.8s ease-in-out"
  },
  atsHint: {
    fontSize: "11px",
    fontWeight: "600"
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px"
  },
  score: {
    fontSize: "12px",
    color: "#94a3b8"
  },
  link: {
    color: "#38bdf8",
    fontSize: "13px",
    fontWeight: "bold",
    textDecoration: "none"
  }
};
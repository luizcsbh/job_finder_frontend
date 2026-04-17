import Button from "../components/Button";

export default function JobDetails({ job, onBack }) {
  if (!job) {
    return (
      <div style={styles.container}>
        <p style={styles.message}>Vaga não encontrada. Por favor, volte e selecione uma vaga novamente.</p>
        <Button onClick={onBack} style={styles.backBtn}>Voltar</Button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backBtn}>← Voltar</button>
      <div style={styles.header}>
        <h1 style={styles.title}>{job.title}</h1>
        <p style={styles.subtitle}>{job.company}</p>
        <span style={styles.sourceTag}>{job.source}</span>
        <Button onClick={() => window.open(job.url, "_blank", "noreferrer") } style={styles.openBtn}>
          Abrir vaga original
        </Button>
      </div>

      <div style={styles.detailsCard}>
        <div style={styles.row}>
          <strong>Pontuação ATS:</strong>
          <span>{Math.min(Math.round(job.ai_score || 0), 100)}%</span>
        </div>
        <div style={styles.row}>
          <strong>Pontuação Geral:</strong>
          <span>{job.score ?? "N/A"}</span>
        </div>
        <div style={styles.row}>
          <strong>Fonte:</strong>
          <span>{job.source}</span>
        </div>
        <div style={styles.row}>
          <strong>URL:</strong>
          <a href={job.url} target="_blank" rel="noreferrer" style={styles.link}>{job.url}</a>
        </div>
        <div style={styles.description}>
          <h3>Descrição da vaga</h3>
          <p>{job.description || "Descrição não disponível no momento."}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff"
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    textAlign: "center"
  },
  backBtn: {
    alignSelf: "flex-start",
    marginBottom: "30px",
    padding: "10px 16px",
    background: "#334155",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  title: {
    fontSize: "32px",
    margin: "0 0 10px 0"
  },
  subtitle: {
    color: "#94a3b8",
    margin: "0 0 12px 0"
  },
  sourceTag: {
    display: "inline-block",
    background: "#334155",
    color: "#94a3b8",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "bold"
  },
  openBtn: {
    padding: "12px 20px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  detailsCard: {
    marginTop: "30px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "30px"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom: "1px solid #334155",
    padding: "16px 0",
    fontSize: "14px"
  },
  link: {
    color: "#38bdf8",
    textDecoration: "underline"
  },
  description: {
    marginTop: "24px",
    color: "#e2e8f0",
    lineHeight: 1.7,
    fontSize: "15px"
  },
  message: {
    marginBottom: "20px",
    color: "#f8fafc",
    fontSize: "16px"
  }
};

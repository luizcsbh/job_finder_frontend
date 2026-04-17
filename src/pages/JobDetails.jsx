import Button from "../components/Button";

export default function JobDetails({ job, onBack }) {
  const normalizeText = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== "string") return normalizeText(parsed);
        return parsed.replace(/<[^>]*>/g, "").trim();
      } catch {
        return value.replace(/<[^>]*>/g, "").trim();
      }
    }
    if (Array.isArray(value)) {
      return value.map(normalizeText).filter(Boolean).join(", ");
    }
    if (typeof value === "object") {
      if (typeof value.text === "string") return normalizeText(value.text);
      if (typeof value.html === "string") return normalizeText(value.html);
      return Object.values(value).map(normalizeText).filter(Boolean).join(" ");
    }
    return String(value);
  };

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
        <Button onClick={() => window.open(job.url, "_blank", "noreferrer")} style={styles.openBtn}>
          Abrir vaga original
        </Button>
      </div>

      <div style={styles.detailsCard}>
        {/* Informações Básicas */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Informações Básicas</h3>
          <div style={styles.row}>
            <strong>Pontuação ATS:</strong>
            <span>{Math.min(Math.round(job.ai_score || 0), 100)}%</span>
          </div>
          <div style={styles.row}>
            <strong>Pontuação Geral:</strong>
            <span>{job.score ?? "N/A"}</span>
          </div>
          <div style={styles.row}>
            <strong>Localização:</strong>
            <span>{normalizeText(job.location) || "Não informado"}</span>
          </div>
          <div style={styles.row}>
            <strong>Fonte:</strong>
            <span>{job.source}</span>
          </div>
        </div>

        {/* Detalhes da Vaga */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Detalhes da Vaga</h3>
          <div style={styles.row}>
            <strong>Data de Publicação:</strong>
            <span>{job.datate_posted ? new Date(job.datate_posted).toLocaleDateString('pt-BR') : "Não informado"}</span>
          </div>
          <div style={styles.row}>
            <strong>Categoria:</strong>
            <span>{normalizeText(job.category) || "Não informado"}</span>
          </div>
          <div style={styles.row}>
            <strong>Salário:</strong>
            <span>{job.salary || "Não informado"}</span>
          </div>
          <div style={styles.row}>
            <strong>URL:</strong>
            <a href={job.url} target="_blank" rel="noreferrer" style={styles.link}>{job.url}</a>
          </div>
        </div>

        {/* Descrição */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Descrição da Vaga</h3>
          <div style={styles.description}>
            <p>{normalizeText(job.description) || "Descrição não disponível no momento."}</p>
          </div>
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
    marginBottom: "20px",
    padding: "10px 16px",
    background: "#334155",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s"
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
    marginTop: "12px",
    padding: "12px 24px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.2s"
  },
  detailsCard: {
    marginTop: "30px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "18px",
    padding: "30px"
  },
  section: {
    marginBottom: "30px"
  },
  sectionTitle: {
    color: "#38bdf8",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    borderBottom: "2px solid #38bdf8",
    paddingBottom: "8px"
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
    marginTop: "15px",
    color: "#e2e8f0",
    lineHeight: 1.7,
    fontSize: "15px",
    background: "#0f172a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #334155"
  },
  message: {
    marginBottom: "20px",
    color: "#f8fafc",
    fontSize: "16px"
  }
};

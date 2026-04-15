export default function ForgotPassword({ goToLogin }) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Alteracao de Senha</h2>
        <p style={styles.text}>
          Por seguranca, a troca de senha agora exige autenticacao.
        </p>
        <p style={styles.text}>
          Faca login normalmente e use o fluxo autenticado de alteracao de senha no backend.
        </p>

        <button onClick={goToLogin} style={styles.button}>
          Voltar para Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    color: "#fff"
  },
  text: {
    fontSize: "14px",
    color: "#94a3b8",
    marginBottom: "14px",
    lineHeight: 1.5
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#facc15",
    color: "#0f172a",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

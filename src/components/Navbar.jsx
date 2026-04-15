export default function Navbar({ currentView, setView, handleLogout }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => setView("main")}>
        🚀 <span>Job Finder Pro</span>
      </div>

      <div style={styles.links}>
        <button 
          onClick={() => setView("main")} 
          style={currentView === "main" ? styles.activeLink : styles.link}
        >
          Vagas
        </button>
        <button 
          onClick={() => setView("favorites")} 
          style={currentView === "favorites" ? styles.activeLink : styles.link}
        >
          Favoritos
        </button>
        <button 
          onClick={() => setView("dashboard")} 
          style={currentView === "dashboard" ? styles.activeLink : styles.link}
        >
          Dashboard
        </button>
      </div>

      <div style={styles.actions}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Sair
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    padding: "0 40px",
    height: "70px",
    background: "#1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #334155",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    color: "#fff"
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  links: {
    display: "flex",
    gap: "10px",
    background: "#0f172a",
    padding: "5px",
    borderRadius: "10px"
  },
  link: {
    padding: "8px 20px",
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s"
  },
  activeLink: {
    padding: "8px 20px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#ef444433",
    color: "#ef4444",
    border: "1px solid #ef444433",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

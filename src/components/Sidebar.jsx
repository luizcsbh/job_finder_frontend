export default function Sidebar({ currentView, setView }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.menu}>
        <button 
          onClick={() => setView("main")} 
          style={currentView === "main" ? styles.activeLink : styles.link}
        >
          🔍 Buscar Vagas
        </button>
        <button 
          onClick={() => setView("favorites")} 
          style={currentView === "favorites" ? styles.activeLink : styles.link}
        >
          ⭐ Favoritos
        </button>
        <button 
          onClick={() => setView("dashboard")} 
          style={currentView === "dashboard" ? styles.activeLink : styles.link}
        >
          📊 Dashboard
        </button>
        <button 
          onClick={() => setView("profile")} 
          style={currentView === "profile" ? styles.activeLink : styles.link}
        >
          👤 Perfil
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "250px",
    background: "#1e293b",
    height: "calc(100vh - 70px)", // Subtraindo a altura do Navbar (70px)
    borderRight: "1px solid #334155",
    padding: "20px 0",
    position: "sticky",
    top: "70px",
    display: "flex",
    flexDirection: "column",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "0 15px",
  },
  link: {
    padding: "12px 15px",
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    textAlign: "left",
    transition: "0.2s",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  activeLink: {
    padding: "12px 15px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  }
};

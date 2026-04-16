import Button from "./Button";

export default function Navbar({ currentView, setView, handleLogout, userProfile }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo} onClick={() => setView("main")}>
        🚀 <span>Job Finder Pro</span>
      </div>

      <div style={styles.links}>
        {/* Links moved to Sidebar */}
      </div>

      <div style={styles.actions}>
        {userProfile?.initials && (
          <div 
            onClick={() => setView("profile")} 
            style={styles.avatarNav}
            title="Ir para o Perfil"
          >
            {userProfile.initials}
          </div>
        )}
        <Button onClick={handleLogout} style={styles.logoutBtn}>
          Sair
        </Button>
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
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
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
  },
  avatarNav: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#38bdf8",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.2s"
  }
};

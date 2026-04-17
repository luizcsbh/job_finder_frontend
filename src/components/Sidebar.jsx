import { useState } from "react";

export default function Sidebar({ currentView, setView, isAdmin }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { id: "main", label: "Buscar Vagas", icon: <SearchIcon /> },
    { id: "favorites", label: "Favoritos", icon: <StarIcon /> },
    { id: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { id: "profile", label: "Perfil", icon: <UserIcon /> },
  ];

  if (isAdmin) {
    menuItems.push({ id: "admin", label: "Painel Admin", icon: <AdminIcon />, privileged: true });
  }

  return (
    <aside 
      style={{
        ...styles.sidebar,
        width: isExpanded ? "260px" : "80px",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div style={styles.menu}>
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)} 
            className={currentView === item.id ? "sidebar-btn-active" : "sidebar-btn"}
            style={{
              ...(currentView === item.id ? (item.privileged ? styles.activePrivilegedLink : styles.activeLink) : (item.privileged ? styles.privilegedLink : styles.link)),
              justifyContent: isExpanded ? "flex-start" : "center",
              padding: isExpanded ? "12px 15px" : "12px 0",
            }}
            title={!isExpanded ? item.label : ""}
          >
            <div style={{ minWidth: "24px", display: "flex", justifyContent: "center" }}>
              {item.icon}
            </div>
            <span style={{
              ...styles.label,
              opacity: isExpanded ? 1 : 0,
              width: isExpanded ? "auto" : 0,
              marginLeft: isExpanded ? "12px" : 0,
            }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

// Icons
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
);
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const AdminIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const styles = {
  sidebar: {
    background: "#1e293b",
    height: "calc(100vh - 70px)",
    borderRight: "1px solid #334155",
    padding: "20px 0",
    position: "sticky",
    top: "70px",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 100,
    overflow: "hidden",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "0 10px",
  },
  link: {
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  activeLink: {
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  privilegedLink: {
    background: "rgba(56, 189, 248, 0.05)",
    color: "#38bdf8",
    border: "1px solid rgba(56, 189, 248, 0.1)",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  activePrivilegedLink: {
    background: "#38bdf8",
    color: "#0f172a",
    border: "1px solid #38bdf8",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
  label: {
    transition: "opacity 0.2s, margin 0.2s",
    fontSize: "14px",
  }
};

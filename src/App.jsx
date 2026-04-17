import { useEffect, useState } from "react";
import { api } from "./services/api";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPasswordWithToken from "./pages/ResetPasswordWithToken";
import AdminDashboard from "./pages/AdminDashboard";

const JOBS_PER_PAGE = 9;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login"); // login, register, main, favorites, dashboard, forgot-password
  const [favoriteUrls, setFavoriteUrls] = useState([]);
  const [resumeMissing, setResumeMissing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [userProfile, setUserProfile] = useState({ name: '', email: '', birthDate: '', initials: '', isAdmin: false });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [recoveryToken, setRecoveryToken] = useState(null);

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/profile");
      const { email, name, birth_date, is_admin } = response.data;
      
      const parsedName = name || 'Usuário';
      const parsedBirthDate = birth_date || '';
      
      const parts = parsedName.trim().split(" ");
      let initials = parts[0] ? parts[0].charAt(0).toUpperCase() : 'U';
      if (parts.length > 1) {
        initials += parts[parts.length - 1].charAt(0).toUpperCase();
      }

      setUserProfile({ email, name: parsedName, birthDate: parsedBirthDate, initials, isAdmin: is_admin });
    } catch (error) {
      console.error("Erro ao carregar perfil do usuario", err);
    }
  };

  useEffect(() => {
    // Check for Supabase Auth hash routing
    const hashStr = window.location.hash;
    if (hashStr && hashStr.includes("type=recovery") && hashStr.includes("access_token=")) {
      const params = new URLSearchParams(hashStr.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        setRecoveryToken(accessToken);
        setView("reset-password-with-token");
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }
    }

    if (token) {
      if (view === "login" || view === "register" || view === "forgot-password") {
        setView("main");
      }
      loadJobs(page, searchTerm);
      loadFavoriteUrls();
      loadUserProfile();
    } else {
      if (view !== "register" && view !== "forgot-password") {
        setView("login");
      }
    }
  }, [token, page]);

  const loadJobs = async (pageToLoad, term = searchTerm) => {
    try {
      const url = term 
        ? `/jobs?page=${pageToLoad}&limit=${JOBS_PER_PAGE}&search=${encodeURIComponent(term)}`
        : `/jobs?page=${pageToLoad}&limit=${JOBS_PER_PAGE}`;
        
      const response = await api.get(url);

      if (response.data.error === "RESUME_REQUIRED") {
        setJobs([]);
        setResumeMissing(true);
        setTotalPages(1);
      } else {
        setJobs(response.data.jobs);
        setResumeMissing(false);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Erro ao carregar vagas", err);
    }
  };

  const loadFavoriteUrls = async () => {
    try {
      const response = await api.get("/favorites");
      setFavoriteUrls(response.data.favorites.map(f => f.url));
    } catch (error) {
      console.error("Erro ao carregar URLs favoritas", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage(1);
    setTotalPages(1);
    setView("login");
  };

  if (view === "login") {
    return (
      <Login 
        setToken={setToken} 
        goToRegister={() => setView("register")} 
        goToForgotPassword={() => setView("forgot-password")}
      />
    );
  }

  if (view === "register") {
    return <Register goToLogin={() => setView("login")} />;
  }

  if (view === "forgot-password") {
    return <ForgotPassword goToLogin={() => setView("login")} />;
  }

  if (view === "reset-password-with-token") {
    return <ResetPasswordWithToken recoveryToken={recoveryToken} goToLogin={() => setView("login")} />;
  }



// New layout wrapping for main authenticated area
  const renderAuthenticatedView = () => {
    let content;
    switch(view) {
      case "favorites":
        content = <Favorites />;
        break;
      case "dashboard":
        content = <Dashboard onRefresh={() => {
          setPage(1);
          loadJobs(1);
        }} />;
        break;
      case "profile":
        content = <Profile userProfile={userProfile} setUserProfile={setUserProfile} handleLogout={handleLogout} />;
        break;
      case "admin":
        if (userProfile.isAdmin) {
          content = <AdminDashboard />;
        } else {
          setView("main");
          content = null;
        }
        break;
      default:
        content = (
          <div style={{ padding: "40px", flex: 1, overflowY: "auto" }}>
            <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              <h2 style={{ color: "#fff", margin: 0 }}>Vagas Disponíveis</h2>
              <div style={styles.searchWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Pesquisar por título ou empresa..."
                  value={searchTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearchTerm(val);
                    if (searchTimeout) clearTimeout(searchTimeout);
                    setSearchTimeout(setTimeout(() => {
                      setPage(1);
                      loadJobs(1, val);
                    }, 400));
                  }}
                  style={styles.searchInput}
                />
              </div>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: resumeMissing ? "1fr" : "repeat(3, 1fr)",
              gap: "20px"
            }}>
              {resumeMissing ? (
                <div style={styles.errorCard}>
                  <h2 style={{ fontSize: "32px" }}>⚠️ Currículo Necessário</h2>
                  <p style={{ fontSize: "18px", color: "#94a3b8" }}>
                    Nossa IA precisa do seu currículo para recomendar as melhores vagas.
                  </p>
                  <button onClick={() => setView("dashboard")} style={styles.dashBtnLarge}>
                    Ir para o Dashboard e Enviar Agora
                  </button>
                </div>
              ) : (
                jobs.map((job, index) => (
                  <JobCard 
                    key={index} 
                    job={job} 
                    isFavorite={favoriteUrls.includes(job.url)}
                    onFavoriteToggle={loadFavoriteUrls}
                  />
                ))
              )}
            </div>
            {!resumeMissing && jobs.length > 0 && <Pagination page={page} setPage={setPage} totalPages={totalPages} />}
            {!resumeMissing && jobs.length === 0 && (
              <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>
                <p>Nenhuma vaga encontrada para "{searchTerm}".</p>
              </div>
            )}
          </div>
        );
    }
    
    return (
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentView={view} setView={setView} isAdmin={userProfile.isAdmin} />
        <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {content}
        </main>
      </div>
    );
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", height: "100vh" }}>
      <Navbar 
        currentView={view} 
        setView={setView} 
        handleLogout={handleLogout} 
        userProfile={userProfile}
      />
      {renderAuthenticatedView()}
    </div>
  );
}

const styles = {
  logoutBtn: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  favNavBtn: {
    padding: "10px 20px",
    background: "#facc15",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  dashBtn: {
    padding: "10px 20px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  errorCard: {
    padding: "40px",
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff"
  },
  dashBtnLarge: {
    marginTop: "20px",
    padding: "15px 30px",
    background: "#38bdf8",
    color: "#0f172a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px"
  },
  searchWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    color: "#64748b"
  },
  searchInput: {
    width: "300px",
    padding: "12px 16px 12px 40px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#fff",
    outline: "none",
    fontSize: "15px",
    transition: "border-color 0.2s"
  }
};

import { useEffect, useState } from "react";
import { api } from "./services/api";
import JobCard from "./components/JobCard";
import Pagination from "./components/Pagination";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Favorites from "./pages/Favorites";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";

const JOBS_PER_PAGE = 9;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login"); // login, register, main, favorites, dashboard, forgot-password
  const [favoriteUrls, setFavoriteUrls] = useState([]);
  const [resumeMissing, setResumeMissing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (token) {
      if (view === "login" || view === "register" || view === "forgot-password") {
        setView("main");
      }
      loadJobs(page);
      loadFavoriteUrls();
    } else {
      if (view !== "register" && view !== "forgot-password") {
        setView("login");
      }
    }
  }, [token, page]);

  const loadJobs = async (page) => {
    try {
      const response = await api.get(`/jobs?page=${page}&limit=${JOBS_PER_PAGE}`);

      if (response.data.error === "RESUME_REQUIRED") {
        setJobs([]);
        setResumeMissing(true);
        setTotalPages(1);
      } else {
        setJobs(response.data.jobs);
        setResumeMissing(false);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Erro ao carregar vagas", err);
    }
  };

  const loadFavoriteUrls = async () => {
    try {
      const response = await api.get("/favorites");
      setFavoriteUrls(response.data.favorites.map(f => f.url));
    } catch (err) {
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

  // Common Layout for Authenticated Pages
  const renderAuthenticatedView = () => {
    switch(view) {
      case "favorites":
        return <Favorites />;
      case "dashboard":
        return <Dashboard onRefresh={() => {
          setPage(1);
          loadJobs(1);
        }} />;
      default:
        return (
          <div style={{ padding: "40px" }}>
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
            {!resumeMissing && <Pagination page={page} setPage={setPage} totalPages={totalPages} />}
          </div>
        );
    }
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Navbar 
        currentView={view} 
        setView={setView} 
        handleLogout={handleLogout} 
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
  }
};

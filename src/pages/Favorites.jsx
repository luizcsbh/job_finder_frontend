import { useEffect, useState } from "react";
import { api } from "../services/api";
import JobCard from "../components/JobCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const response = await api.get("/favorites");
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Erro ao carregar favoritos", error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <div style={{ padding: "40px", background: "#0f172a", minHeight: "100vh" }}>
      <h1 style={{ color: "#fff", marginBottom: "30px" }}>⭐ Suas Vagas Favoritas</h1>

      {favorites.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "50px" }}>
          Você ainda não favoritou nenhuma vaga.
        </p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px"
        }}>
          {favorites.map((job, index) => (
            <JobCard 
              key={index} 
              job={job} 
              isFavorite={true}
              onFavoriteToggle={loadFavorites}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./PagesCss/ChoosePlatform.css";

function ChoosePlatformPage() {
  const [userId, setUserId] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({});
  const [bestPlatform, setBestPlatform] = useState(null);

  // Obtener el userId interno
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL || "https://tfgv2.onrender.com"}/api/usuarios/${user.uid}`
        );
        const data = await res.json();
        setUserId(data.id);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Obtener favoritos del usuario
  useEffect(() => {
    if (!userId) {
      setFavoritos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `${process.env.REACT_APP_BACKEND_URL || "https://tfgv2.onrender.com"}/api/favoritos/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setFavoritos(data.favoritos || []);
        setLoading(false);
      })
      .catch(() => setFavoritos([]));
  }, [userId]);

  // Calcular estadísticas por plataforma (sin duplicados)
  useEffect(() => {
    if (!favoritos.length) {
      setPlatformStats({});
      setBestPlatform(null);
      return;
    }
    const stats = {};
    favoritos.forEach((fav) => {
      if (Array.isArray(fav.plataformas)) {
        fav.plataformas.forEach((plat) => {
          if (!stats[plat]) stats[plat] = { count: 0, titles: new Set() };
          stats[plat].titles.add(fav.titulo);
        });
      }
    });
    Object.keys(stats).forEach((plat) => {
      stats[plat].count = stats[plat].titles.size;
      stats[plat].titles = Array.from(stats[plat].titles);
    });
    setPlatformStats(stats);

    // Mejor plataforma
    let best = null;
    let max = 0;
    Object.entries(stats).forEach(([plat, info]) => {
      if (info.count > max) {
        max = info.count;
        best = plat;
      }
    });
    setBestPlatform(best);
  }, [favoritos]);

  if (!userId) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Escoge la mejor plataforma</h2>
        <p>Debes iniciar sesión para ver tus estadísticas y recomendaciones.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ padding: 32 }}>Cargando tus estadísticas...</div>;
  }

  return (
    <div className="choose-platform-page">
      <h2>Estadísticas de tus Favoritos</h2>
      <p>
        Tienes <b>{favoritos.length}</b> películas/series en favoritos.
      </p>
      <h3>Disponibilidad por plataforma:</h3>
      <ul>
        {Object.entries(platformStats).map(([plat, info]) => (
          <li key={plat}>
            <b>{plat}</b>: {info.count} títulos favoritos disponibles
            <ul>
              {info.titles.slice(0, 5).map((title, i) => (
                <li key={i} style={{ fontSize: "0.95em", color: "#888" }}>
                  {title}
                </li>
              ))}
              {info.titles.length > 5 && (
                <li style={{ fontSize: "0.9em", color: "#aaa" }}>
                  ...y {info.titles.length - 5} más
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
      <h3>Ranking de plataformas recomendadas</h3>
      <ol>
        {Object.entries(platformStats)
          .sort((a, b) => b[1].count - a[1].count)
          .map(([plat, info], idx) => (
            <li key={plat} style={{ fontWeight: plat === bestPlatform ? "bold" : "normal" }}>
              {plat} ({info.count} favoritos)
              {plat === bestPlatform && (
                <span className="best-platform">★ Mejor opción</span>
              )}
            </li>
          ))}
      </ol>
      {bestPlatform && (
        <div className="recommend-box">
          <h2>¡Te recomendamos contratar <span style={{ color: "#27ae60" }}>{bestPlatform}</span>!</h2>
          <p>
            Es la plataforma donde más de tus favoritos están disponibles.
          </p>
        </div>
      )}
      {!Object.keys(platformStats).length && (
        <div style={{ marginTop: 32 }}>
          <p>No tienes favoritos asociados a ninguna plataforma.</p>
        </div>
      )}
    </div>
  );
}

export default ChoosePlatformPage;
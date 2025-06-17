import React, { useEffect, useState } from 'react';
import './FavoritosPage.css';

const FavoritosPage = ({ userId }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  // Scroll al principio al montar el componente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/favoritos/${userId}`)
      .then(res => res.json())
      .then(data => {
        setFavoritos(data.favoritos || []);
      })
      .catch(() => setFavoritos([]));
  }, [userId]);

  const handleDelete = async (fav) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/favoritos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, show_id: fav.show_id }),
    });
    setFavoritos(favoritos.filter(f => f.show_id !== fav.show_id));
    setConfirmDelete(null);
    window.dispatchEvent(new CustomEvent('favorito-eliminado', { detail: { show_id: fav.show_id } }));
  };

  // Eliminar todos los favoritos del usuario
  const handleDeleteAll = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/favoritos/todos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId }),
    });
    setFavoritos([]);
    setConfirmDeleteAll(false);
    window.dispatchEvent(new CustomEvent('favoritos-vaciados', { detail: { usuario_id: userId } }));
  };

  if (!userId) {
    return (
      <div className="favoritos-page-container">
        <div className="favoritos-page-header">
          <h2 className="favoritos-page-title favoritos-page-title-centered">Tus Favoritos</h2>
        </div>
        <div className="favoritos-page-empty">
          Debes iniciar sesión para ver tus favoritos.
        </div>
      </div>
    );
  }

  return (
    <div className="favoritos-page-container">
      <div className="favoritos-page-header" style={{ position: "relative" }}>
        <h2 className="favoritos-page-title favoritos-page-title-centered">Tus Favoritos</h2>
      </div>
      <div className="favoritos-page-grid">
        {favoritos.length === 0 && (
          <div className="favoritos-page-empty">
            No tienes favoritos.
          </div>
        )}
        {favoritos.map(fav => (
          <div
            key={fav.show_id}
            className="favoritos-page-card"
            style={{ cursor: "pointer" }}
            onClick={() => setConfirmDelete(fav)}
          >
            <img
              src={fav.poster}
              alt={fav.titulo}
              className="favoritos-page-img"
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div className="favoritos-page-card-title-row" style={{ display: "flex", alignItems: "center", width: "100%" }}>
                <span className="favoritos-page-card-title">{fav.titulo}</span>
              </div>
              <div className="favoritos-page-card-year">{fav.anio}</div>
            </div>
          </div>
        ))}
      </div>
      {confirmDelete && (
        <div className="favoritos-page-confirm-overlay">
          <div className="favoritos-page-confirm-content">
            <h3>¿Eliminar de favoritos?</h3>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                className="favoritos-page-confirm-btn"
                onClick={() => handleDelete(confirmDelete)}
              >Eliminar</button>
              <button
                className="favoritos-page-cancel-btn"
                onClick={() => setConfirmDelete(null)}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteAll && (
        <div className="favoritos-page-confirm-overlay">
          <div className="favoritos-page-confirm-content">
            <h3>¿Eliminar <b>todos</b> tus favoritos?</h3>
            <div style={{ display: "flex", gap: 16 }}>
              <button
                className="favoritos-page-confirm-btn"
                onClick={handleDeleteAll}
              >Eliminar todos</button>
              <button
                className="favoritos-page-cancel-btn"
                onClick={() => setConfirmDeleteAll(false)}
              >Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritosPage;
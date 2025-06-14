import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importa useNavigate
import "./FavoritosModal.css";

const FavoritosModal = ({ userId, visible, onClose }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate(); // <-- Hook para navegar

  useEffect(() => {
    if (!visible || !userId) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/favoritos/${userId}`)
        .then(res => res.json())
        .then(data => {
        setFavoritos(data);
        })
        .catch(() => setFavoritos([]));
    }, [visible, userId]);

  const handleDelete = async (fav) => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/favoritos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, show_id: fav.show_id }),
    });
    setFavoritos(favoritos.filter(f => f.show_id !== fav.show_id));
    setConfirmDelete(null);
  };

  if (!visible) return null;

  return (
    <div className="favoritos-modal-overlay">
      <div className="favoritos-modal-content">
        <h2 className="favoritos-modal-title">Tus Favoritos</h2>
        <button className="favoritos-modal-close" onClick={onClose}>×</button>
        <div className="favoritos-modal-grid">
          {favoritos.length === 0 && (
            <div className="favoritos-modal-empty">
              No tienes favoritos.
            </div>
          )}
          {favoritos.map(fav => (
            <div
              key={fav.show_id}
              className="favoritos-modal-card"
              onClick={() => {
                onClose();
                navigate('/info', { state: { show_id: fav.show_id } });
                }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={fav.poster}
                alt={fav.titulo}
                className="favoritos-modal-img"
              />
              <div style={{ flex: 1 }}>
                <div className="favoritos-modal-card-title">{fav.titulo}</div>
                <div className="favoritos-modal-card-year">{fav.anio}</div>
              </div>
              <button
                className="favoritos-modal-like-btn"
                onClick={e => {
                  e.stopPropagation();
                  setConfirmDelete(fav);
                }}
                title="Eliminar de favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="#e74c3c">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        {confirmDelete && (
          <div className="favoritos-modal-confirm-overlay">
            <div className="favoritos-modal-confirm-content">
              <h3>¿Eliminar de favoritos?</h3>
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  className="favoritos-modal-confirm-btn"
                  onClick={() => handleDelete(confirmDelete)}
                >Eliminar</button>
                <button
                  className="favoritos-modal-cancel-btn"
                  onClick={() => setConfirmDelete(null)}
                >Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritosModal;
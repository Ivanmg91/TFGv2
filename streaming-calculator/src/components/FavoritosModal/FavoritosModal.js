import React, { useEffect, useState } from 'react';

const FavoritosModal = ({ userId, visible, onClose }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null); // id del favorito a borrar

  useEffect(() => {
    if (!visible || !userId) return;
    // Llama a tu backend para obtener los favoritos del usuario
    fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/api/favoritos/${userId}`)
      .then(res => res.json())
      .then(data => setFavoritos(data))
      .catch(() => setFavoritos([]));
  }, [visible, userId]);

  const handleDelete = async (fav) => {
    // Llama a tu backend para borrar el favorito
    await fetch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000'}/api/favoritos`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, show_id: fav.show_id }),
    });
    setFavoritos(favoritos.filter(f => f.show_id !== fav.show_id));
    setConfirmDelete(null);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.7)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#232a32", borderRadius: 16, padding: 32, minWidth: 600, maxWidth: "90vw",
        maxHeight: "80vh", overflowY: "auto", boxShadow: "0 4px 24px #000a"
      }}>
        <h2 style={{ color: "#fff", textAlign: "center" }}>Tus Favoritos</h2>
        <button onClick={onClose} style={{
          position: "absolute", top: 24, right: 36, background: "none", color: "#fff", border: "none", fontSize: 28, cursor: "pointer"
        }}>×</button>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 24
        }}>
          {favoritos.length === 0 && <div style={{ color: "#fff", gridColumn: "1/3", textAlign: "center" }}>No tienes favoritos.</div>}
          {favoritos.map(fav => (
            <div key={fav.show_id} style={{
              display: "flex", alignItems: "center", background: "#1a2027", borderRadius: 12, padding: 12, gap: 16
            }}>
              <img
                src={fav.poster}
                alt={fav.titulo}
                style={{ width: 180, height: 100, objectFit: "cover", borderRadius: 8, background: "#222" }}
              />
              <div style={{ flex: 1, color: "#fff" }}>
                <div style={{ fontWeight: "bold", fontSize: 16 }}>{fav.titulo}</div>
                <div style={{ fontSize: 13, color: "#bfc9d4" }}>{fav.anio}</div>
              </div>
              <button
                style={{ background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setConfirmDelete(fav)}
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
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#232a32", color: "#fff", borderRadius: 12, padding: 32, minWidth: 300, boxShadow: "0 4px 24px #000a",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 16
            }}>
              <h3>¿Eliminar de favoritos?</h3>
              <div style={{ display: "flex", gap: 16 }}>
                <button
                  style={{ background: "#e74c3c", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => handleDelete(confirmDelete)}
                >Eliminar</button>
                <button
                  style={{ background: "#888", color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: "bold", cursor: "pointer" }}
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
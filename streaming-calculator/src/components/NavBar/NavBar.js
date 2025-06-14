import { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import FavoritosModal from '../FavoritosModal/FavoritosModal.js';

const NavBar = ({
  setSearchText, // Props
}) => {
  const [searchFieldText, setSearchFieldText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [showFavoritos, setShowFavoritos] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      // Obtén el id interno del usuario
      fetch(`${process.env.REACT_APP_BACKEND_URL || 'https://tfgv2.onrender.com'}/api/usuarios/${currentUser.uid}`)
        .then(res => res.json())
        .then(data => setUserId(data.id))
        .catch(() => setUserId(null));
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Update search field
  const handleSearchChange = (event) => {
    setSearchFieldText(event.target.value);
  };

  // Buscar películas
  const handleSearchMovies = () => {
    if (!searchFieldText.trim()) return;
    setSearchText(searchFieldText);
    setSearchFieldText(""); // Clear the input
    navigate('/search');
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/home');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo" style={{ display: "flex", alignItems: "center" }}>
          <img src="/originallogo.png" alt="Logo" />
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/home">Inicio</Link></li>
          <li><Link to="/see">Descubrir</Link></li>
          <li><Link to="/recommendations">Recomendaciones</Link></li>
          <li>
            <span
              className="navbar-favoritas-link no-link-style"
              onClick={() => setShowFavoritos(true)}
              style={{ cursor: "pointer" }}
            >
              Favoritas
            </span>
          </li>
          {showFavoritos && <FavoritosModal userId={userId} visible={showFavoritos} onClose={() => setShowFavoritos(false)} />}
          <li><Link to="/chooseplatform">Escoger Plataforma</Link></li>
        </ul>
      </div>
      <div className="navbar-right">
        <input
          className='navbar-searchfield'
          type='text'
          placeholder='Buscar película... (sin filtros)'
          value={searchFieldText}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchMovies}>Buscar</button>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span>{user.email}</span>
            <button onClick={handleSignOut}>Cerrar sesión</button>
          </div>
        ) : (
          <div style={{ position: "relative", display: "inline-block" }}>
            <button onClick={() => setAuthMenuOpen((open) => !open)}>
              Iniciar Sesión
            </button>
            {authMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "#222",
                  border: "1px solid #444",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px #0004",
                  zIndex: 100,
                  padding: 12,
                  minWidth: 160,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <button
                  style={{ width: "100%" }}
                  onClick={() => {
                    setAuthMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  style={{ width: "100%" }}
                  onClick={() => {
                    setAuthMenuOpen(false);
                    navigate("/register");
                  }}
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        )}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <ul>
              <li>Configuración</li>
              <li><Link to="/whoweare" className="no-link-style">Quiénes Somos</Link></li>
              <li>Api</li>
              <li>Aviso Legal</li>
              <li>FAQ</li>
              <li>Terms of Use</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
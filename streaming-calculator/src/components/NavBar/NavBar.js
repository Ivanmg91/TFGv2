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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearchMovies();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top-row">
        {/* Botón usuario en móvil, oculto en desktop */}
        {isMobile ? (
          <button
            className="user-btn"
            onClick={() => setAuthMenuOpen((open) => !open)}
            title="Usuario"
          >
            {/* Feather user icon outline */}
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        ) : (
          // Botón menú hamburguesa solo en desktop (opcional, puedes eliminar si no lo quieres en desktop)
          <button className="menu-btn" onClick={() => setMenuOpen((open) => !open)}>☰</button>
        )}
        <a href="/" className="logo">
          <img src="/logotumbado.png" alt="Logo" />
        </a>
        <div className="navbar-mobile-icons">
          <button
            className="icon-btn"
            onClick={() => {
              // Navega a la página de favoritos y pasa el userId por state
              navigate('/favoritos', { state: { userId } });
            }}
            title="Favoritos"
          >
            {/* Feather heart icon outline */}
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button className="icon-btn" onClick={() => navigate('/chooseplatform')} title="Plataforma">
            {/* Feather layers icon outline */}
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown de usuario en móvil */}
      {isMobile && authMenuOpen && (
        <div className="auth-dropdown-mobile">
          {user ? (
            <>
              <div style={{ padding: "0.7rem 1.2rem", color: "var(--md-sys-color-on-surface)" }}>
                Has iniciado sesión como<br /><b>{user.email}</b>
              </div>
              <button onClick={() => { setAuthMenuOpen(false); handleSignOut(); }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => { setAuthMenuOpen(false); navigate("/login"); }}>Iniciar Sesión</button>
              <button onClick={() => { setAuthMenuOpen(false); navigate("/register"); }}>Registrarse</button>
            </>
          )}
        </div>
      )}

      {!isMobile && (
        <div className="navbar-bottom-row">
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
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSearchMovies}>Buscar</button>
            {/* Usuario */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>{user.email}</span>
                <button onClick={handleSignOut}>Cerrar sesión</button>
              </div>
            ) : (
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Botón solo abre el dropdown, no navega */}
                <button onClick={() => setAuthMenuOpen((open) => !open)}>Iniciar Sesión</button>
                {authMenuOpen && (
                  <div className="auth-dropdown-desktop">
                    <button onClick={() => { setAuthMenuOpen(false); navigate("/login"); }}>Iniciar Sesión</button>
                    <button onClick={() => { setAuthMenuOpen(false); navigate("/register"); }}>Registrarse</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isMobile && (
        <div className="navbar-mobile-row">
          <div className="navbar-mobile-links">
            <Link to="/home">Inicio</Link>
            <Link to="/see">Descubrir</Link>
            <Link to="/recommendations">Recomendaciones</Link>
          </div>
          <div className="navbar-mobile-search">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchFieldText}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      )}
      {/* El menú hamburguesa solo aparece en desktop */}
      {!isMobile && menuOpen && (
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
    </nav>
  );
};

export default NavBar;
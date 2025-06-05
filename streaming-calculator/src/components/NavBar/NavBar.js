import { useState, useEffect } from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const NavBar = ({
  setSearchText, // Props
}) => {
  const [searchFieldText, setSearchFieldText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // Nuevo estado para el menú
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
        <a href="/" className="logo">
          Streaming Calculator
        </a>
      </div>
      <div className="navbar-center">
        <ul className="nav-links">
          <li><Link to="/home">Inicio</Link></li>
          <li><Link to="/see">Descubrir</Link></li>
          <li><Link to="/popular">Popular</Link></li>
          <li><Link to="/new">Nuevo</Link></li>
          {/* Cambiar a Favoritoos el de nuevo */}
        </ul>
      </div>
      <div>
        <input
          className='navbar-searchfield'
          type='text'
          placeholder='Buscar película... (sin filtros)'
          value={searchFieldText}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchMovies}>Buscar</button>
      </div>
      <div>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* DEBERIA MOSTRAR EL NOMBRE DE USUARIO */}
            <span>{user.email}</span> 
            <button onClick={handleSignOut}>Cerrar sesión</button>
          </div>
        ) : (
          <button>
            <Link to="/register" className="no-link-style">Iniciar Sesión</Link>
          </button>
        )}
      </div>
      <div className="navbar-right">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {/* Puedes usar un icono aquí */}
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
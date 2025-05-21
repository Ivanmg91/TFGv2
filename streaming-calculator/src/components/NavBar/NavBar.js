import React, { useState } from 'react';
import './NavBar.css'
import { Link, useNavigate } from 'react-router-dom';

const NavBar = ({
  setSearchText, // Props
}) => {
  const [searchFieldText, setSearchFieldText] = useState("");
  const navigate = useNavigate();

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
          <li><Link to="/new">Nuevo</Link></li>
          <li><Link to="/popular">Popular</Link></li>
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
        <button>Iniciar Sesión</button>
      </div>
      <div className="navbar-right">
        {/* AÑADIR MENU SEMEJANTE JUSTWATCH */}
      </div>
    </nav>
  );
};

export default NavBar;
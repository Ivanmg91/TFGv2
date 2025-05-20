import React, { useState } from 'react';
import * as api from '../../api.js';
import './NavBar.css'

const NavBar = ({
  setMovies, 
  setCursor, 
  setPrevCursors, 
  setHasMore, 
  setLoading,
}) => {
  const [searchFieldText, setSearchText] = useState("");

  // Clear search text
      const handleClearSearchText = () => {
        setSearchText(""); // Vaciar el fieldtext
      };
      const handleSearchChange = (event) => {
        setSearchText(event.target.value);
      };
      
      // Search movies
      const handleSearchMovies = async () => {
        if (!searchFieldText.trim()) return; // Avoid empty searchs
        setLoading(true);
        const result = await api.getShowsByTitle(searchFieldText);
        setMovies(result.movies);
        setHasMore(result.hasMore);
        setCursor(result.nextCursor);
        setPrevCursors([]); // Reset cursors
      
        setLoading(false);
        handleClearSearchText();
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
          <li><a href="/home">Inicio</a></li>
          <li><a href="/see">Ver</a></li>
          <li><a href="/new">Nuevo</a></li>
          <li><a href="/popular">Popular</a></li>
        </ul>
      </div>
      <div>
        <input className='navbar-searchfield' type='text' placeholder='Buscar película... (sin filtros)' value={searchFieldText} onChange={handleSearchChange}></input>
        <button onClick={handleSearchMovies}>Buscar</button>
      </div>
      <div>
        <button >Iniciar Sesión</button>
      </div>
      <div className="navbar-right" hacer un menu como el de justwatch>
        
      </div>
    </nav>
  );
};

export default NavBar;
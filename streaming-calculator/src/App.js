import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';

function App() {
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);

  // Cargar primera tanda de películas
  useEffect(() => {
    fetchInitialMovies();
  }, []);

  async function fetchInitialMovies() {
    const result = await api.getShows();
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  }

  const handleNextPage = async () => {
    if (!hasMore) return;
    const result = await api.getShows(cursor);
    setPrevCursors(prev => [...prev, cursor]);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  const handlePrevPage = async () => {
    if (prevCursors.length === 0) return;
    const prevCursor = prevCursors[prevCursors.length - 2];
    const result = await api.getShows(prevCursor);
    setPrevCursors(prev => prev.slice(0, -1));
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Información de la Película</h1>
      </header>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <img src={movie.poster} alt={movie.title} />
              <div className="card-content">
                <h3 className="card-title">{movie.title}</h3>
                <p className="card-description">{movie.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Cargando películas...</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={prevCursors.length === 0}>
          Anterior
        </button>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default App;
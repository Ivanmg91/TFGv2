import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';

function App() {
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const[selectedGenres, setSelectedGenres] = useState([]);

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

  async function fetchMovies() {
    const result = await api.getShows(cursor, selectedGenres);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  }

  const handleNextPage = async () => {
    if (!hasMore) return;
    const result = await api.getShows(cursor, selectedGenres);
    setPrevCursors(prev => [...prev, cursor]);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  const handlePrevPage = async () => {
    if (prevCursors.length === 0) return;
    const prevCursor = prevCursors[prevCursors.length - 2];
    const result = await api.getShows(prevCursor, selectedGenres);
    setPrevCursors(prev => prev.slice(0, -1));
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genre) => genre !== value)
    );
  };

  const handleApplyFilters = () => {
    console.log("Géneros seleccionados:", selectedGenres);
    // Aquí puedes usar `selectedGenres` para filtrar las películas o realizar alguna acción
    fetchMovies()
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Información de la Película</h1>
      </header>

      <div className="filters-row">
        <text className='filters'>&#x25BC;Filtros</text>
        <button>Seleccionar Plataformas</button>
        <button>Películas/Series</button>
        <div className='dropdown'>
          <label class="dropbutton">Generos</label>
          <div className='dropdown-content'>
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="action" onChange={handleGenreChange} />
              Acción
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="adventure" onChange={handleGenreChange} />
              Aventura
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="animation" onChange={handleGenreChange} />
              Animación
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="comedy" onChange={handleGenreChange} />
              Comedia
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="crime" onChange={handleGenreChange} />
              Crimen
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="documentary" onChange={handleGenreChange} />
              Documental
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="drama" onChange={handleGenreChange} />
              Drama
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="family" onChange={handleGenreChange} />
              Familiar
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="fantasy" onChange={handleGenreChange} />
              Fantasia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="history" onChange={handleGenreChange} />
              Historia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="horror" onChange={handleGenreChange} />
              Horror
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="music" onChange={handleGenreChange} />
              Music
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="mistery" onChange={handleGenreChange} />
              Misterio
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="news" onChange={handleGenreChange} />
              Noticias
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="reality" onChange={handleGenreChange} />
              Reality
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="romance" onChange={handleGenreChange} />
              Romance
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="scifi" onChange={handleGenreChange} />
              Ciencia Ficción
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="talk" onChange={handleGenreChange} />
              Entrevista
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="thriller" onChange={handleGenreChange} />
              Thriller
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="war" onChange={handleGenreChange} />
              Guerra
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="western" onChange={handleGenreChange} />
              Western
            </label>

            <button onClick={handleApplyFilters}>
              Aplicar
            </button>
          </div>
        </div>

        <button>Rating Min</button>
        <button>Min Relase Year</button>
        <button>Max Relase Year</button>
        <button>Order by</button>
        <button>Order type: asc, desc</button>
      </div>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="movie-card" key={index}>
              <img src={movie.poster} alt={movie.title} />
              <div className="card-content">
                <h3 className="card-title">{movie.title}</h3>
                <p className="card-description">{movie.description}</p>
                <p className="card-genres">
                  {Array.isArray(movie.genres)
                  ? movie.genres.join(", ") // Combina los géneros en una cadena separada por comas
                  : movie.genres}
                </p>
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
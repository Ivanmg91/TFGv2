import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';

function App() {
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const[selectedGenres, setSelectedGenres] = useState([]);
  const [searchFieldText, setSearchText] = useState("");

  // Cargar primera tanda de películas
  useEffect(() => {
    fetchInitialMovies();
  }, []);

  // Initial shows
  async function fetchInitialMovies() {
    const result = await api.getShowsByFilters();
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  }

  // Next page button
  const handleNextPage = async () => {
    if (!hasMore) return;
    const result = await api.getShowsByFilters(cursor, selectedGenres);
    setPrevCursors(prev => [...prev, cursor]);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  // Prev page button
  const handlePrevPage = async () => {
    if (prevCursors.length === 0) return;
    const prevCursor = prevCursors[prevCursors.length - 2];
    const result = await api.getShowsByFilters(prevCursor, selectedGenres);
    setPrevCursors(prev => prev.slice(0, -1));
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  // Change genres
  const handleGenreChange = (event) => {
    const { value, checked } = event.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((genre) => genre !== value)
    );
  };

  // Apply filters
  const handleApplyFilters = async () => {
    console.log("Géneros seleccionados:", selectedGenres);
  
    // Restablecer el estado para comenzar desde la primera página
    setCursor(null);
    setMovies([]);
    setPrevCursors([]);

    // Deseleccionar los checkbuttons seleccionados
    handleClearFilters();
    handleClearSearchText();
  
    // Obtener las películas con los filtros aplicados desde la primera página
    const result = await api.getShowsByFilters(null, selectedGenres);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSelectedGenres([]); // Vaciar los géneros seleccionados
  };

  // Clear search text
  const handleClearSearchText = () => {
    setSearchText(""); // Vaciar los géneros seleccionados
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Search movies
  const handleSearchMovies = async () => {
    if (!searchFieldText.trim()) return; // Avoid empty searchs
    const result = await api.searchShowsByTitle(searchFieldText);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
    setPrevCursors([]); // Reset cursors
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
              <input type="checkbox" name="dropdown-group" value="action" checked={selectedGenres.includes("action")} onChange={handleGenreChange} />
              Acción
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="adventure" checked={selectedGenres.includes("adventure")} onChange={handleGenreChange} />
              Aventura
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="animation" checked={selectedGenres.includes("animation")} onChange={handleGenreChange} />
              Animación
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="comedy" checked={selectedGenres.includes("comedy")} onChange={handleGenreChange} />
              Comedia
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="crime" checked={selectedGenres.includes("crime")} onChange={handleGenreChange} />
              Crimen
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="documentary" checked={selectedGenres.includes("documentary")} onChange={handleGenreChange} />
              Documental
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="drama" checked={selectedGenres.includes("drama")} onChange={handleGenreChange} />
              Drama
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="family" checked={selectedGenres.includes("family")} onChange={handleGenreChange} />
              Familiar
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="fantasy" checked={selectedGenres.includes("fantasy")} onChange={handleGenreChange} />
              Fantasia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="history" checked={selectedGenres.includes("history")} onChange={handleGenreChange} />
              Historia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="horror" checked={selectedGenres.includes("horror")} onChange={handleGenreChange} />
              Horror
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="music" checked={selectedGenres.includes("music")} onChange={handleGenreChange} />
              Music
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="mistery" checked={selectedGenres.includes("mistery")} onChange={handleGenreChange} />
              Misterio
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="news" checked={selectedGenres.includes("news")} onChange={handleGenreChange} />
              Noticias
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="reality" checked={selectedGenres.includes("reality")} onChange={handleGenreChange} />
              Reality
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="romance" checked={selectedGenres.includes("romance")} onChange={handleGenreChange} />
              Romance
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="scifi" checked={selectedGenres.includes("scifi")} onChange={handleGenreChange} />
              Ciencia Ficción
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="talk" checked={selectedGenres.includes("talk")} onChange={handleGenreChange} />
              Entrevista
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="thriller" checked={selectedGenres.includes("thriller")} onChange={handleGenreChange} />
              Thriller
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-group" value="war" checked={selectedGenres.includes("war")} onChange={handleGenreChange} />
              Guerra
            </label>
            
            <label class="dropdown-option">
              <input className='genre-checkbutton' type="checkbox" name="dropdown-group" value="western" checked={selectedGenres.includes("western")} onChange={handleGenreChange} /*al pulsar el boton hace handleclearfilters q los borra de la lista y como no estan en la lista de selectedgenres los desmarca*//>
              Western
            </label> 

            <button onClick={handleApplyFilters}>
              Aplicar
            </button>

            <button onClick={handleClearFilters}>
              Quitar todos
            </button>
          </div>
        </div>

        <button>Rating Min</button>
        <button>Min Relase Year</button>
        <button>Max Relase Year</button>
        <button>Order by</button>
        <button>Order type: asc, desc</button>
        <input type='text' placeholder='Buscar película...' value={searchFieldText} onChange={handleSearchChange} className='search-textfield'></input>
        <button onClick={handleSearchMovies}>Buscar</button>
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
                  ? movie.genres.join(", ")
                  : movie.genres}
                </p>
              </div>
            </div>
          ))
        ) : hasMore ? (
          <p>Cargando películas...</p>
        ) : (
          <p>No se encontraron resultados.</p>
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
import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';

function App() {
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const[selectedGenres, setSelectedGenres] = useState([]);
  const[selectedPlatforms, setSelectedPlatforms] = useState([]);
  const[selectedShowTypes, setSelectedShowTypes] = useState([]);
  const [searchFieldText, setSearchText] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Cargar primera tanda de películas
  useEffect(() => {
    fetchInitialMovies();
  }, []);

  // Initial shows
  async function fetchInitialMovies() {
    const result = await api.getTopShows(); //getshowsbyfilter puede usar pagination
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  }

  // Next page button
  const handleNextPage = async () => {
    if (!hasMore) return;
    const result = await api.getShowsByFilters(cursor, selectedGenres, selectedPlatforms, selectedShowTypes);
    setPrevCursors(prev => [...prev, cursor]);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  // Prev page button
  const handlePrevPage = async () => {
    if (prevCursors.length === 0) return;
    const prevCursor = prevCursors[prevCursors.length - 2];
    const result = await api.getShowsByFilters(prevCursor, selectedGenres, selectedPlatforms, selectedShowTypes);
    setPrevCursors(prev => prev.slice(0, -1));
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  };

  // Apply filters
  const handleApplyFilters = async () => {
  
    // Actualizar la lista de géneros seleccionados
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-genres"]:checked');
    const selected = Array.from(checkboxes).map((checkbox) => checkbox.value);
    setSelectedGenres(selected); // Se borran los q estaban en la lista

    // Actualizar la lista de plataformas seleccionadas
    const checkboxesPlatforms = document.querySelectorAll('input[type="checkbox"][name="dropdown-platforms"]:checked');
    const selectedPlatforms = Array.from(checkboxesPlatforms).map((checkbox) => checkbox.value);
    setSelectedPlatforms(selectedPlatforms);

    // Actualizar la lista de showtypes seleccionados
    const checkboxesShowTypes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
    const selectedShowTypes = Array.from(checkboxesShowTypes).map((checkbox) => checkbox.value);
    setSelectedShowTypes(selectedShowTypes);
  
    // Restablecer el estado para comenzar desde la primera página
    setCursor(null);
    setMovies([]);
    setPrevCursors([]);
  
    // Obtener las películas con los filtros aplicados desde la primera página
    const result = await api.getShowsByFilters(null, selected, selectedPlatforms, selectedShowTypes);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);

    handleClearAll();
  };

  // Clear filters
  const handleClearGenres = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-genres"]:checked');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Desmarcar cada checkbox
    });
  };

  // Clear filters
  const handleClearPlatforms = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-platforms"]:checked');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Desmarcar cada checkbox
    });
  };

  // Clear search text
  const handleClearSearchText = () => {
    setSearchText(""); // Vaciar el fieldtext
  };

  // Clear showtypes
  const handleClearShowTypes = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Desmarcar cada checkbox
    });
  };

  // Clear all the filters
  const handleClearAll = () => {
    handleClearGenres();
    handleClearPlatforms();
    handleClearSearchText();
    handleClearShowTypes();
  }

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Search movies
  const handleSearchMovies = async () => {
    if (!searchFieldText.trim()) return; // Avoid empty searchs
    const result = await api.getShowsByTitle(searchFieldText);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
    setPrevCursors([]); // Reset cursors

    handleClearAll();
  };

  // More info cards
  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setIsMenuVisible(true);
  };















  return (
    <div className="App">
      <header className="App-header">
        <h1>Información de la Película</h1>
      </header>

      <div className="filters-row">
        <text className='filters'>&#x25BC;Filtros</text>
        <div className='dropdown'>
          <label class="dropbutton">Plataformas</label>
          <div className='dropdown-content'>
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="netflix" />
              Netflix
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="hbo" />
              HBO
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="disney" />
              Disney
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="prime" />
              Prime
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="apple"  />
              Apple
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="mubi" />
              Mubi
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="curiosity" />
              Curiosity
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="plutotv" />
              Pluto TV
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-platforms" value="zee5"/>
              Zee5
            </label>

            <button onClick={handleClearPlatforms}>
              Quitar todos
            </button>
          </div>
        </div>
        <div className='dropdown'>
          <label class="dropbutton">Películas/Series</label>
          <div className='dropdown-content'>
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-showtype" value="movie" />
              Películas
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-showtype" value="series" />
              Series
            </label>

            <button onClick={handleClearGenres}>
              Quitar todos
            </button>
          </div>
        </div>
        <div className='dropdown'>
          <label class="dropbutton">Generos</label>
          <div className='dropdown-content'>
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="action" />
              Acción
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="adventure" />
              Aventura
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="animation" />
              Animación
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="comedy" />
              Comedia
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="crime"  />
              Crimen
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="documentary" />
              Documental
            </label>

            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="drama" />
              Drama
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="family" />
              Familiar
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="fantasy"/>
              Fantasia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="history" />
              Historia
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="horror" />
              Horror
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="music" />
              Music
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="mystery" />
              Misterio
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="news" />
              Noticias
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="reality" />
              Reality
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="romance" />
              Romance
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="scifi" />
              Ciencia Ficción
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="talk" />
              Entrevista
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="thriller" />
              Thriller
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="war" />
              Guerra
            </label>
            
            <label class="dropdown-option">
              <input type="checkbox" name="dropdown-genres" value="western" /*al pulsar el boton hace handleclearfilters q los borra de la lista y como no estan en la lista de selectedgenres los desmarca*//>
              Western
            </label> 

            <button onClick={handleClearGenres}>
              Quitar todos
            </button>
          </div>
        </div>

        <button>Rating Min</button>
        <button>Min Relase Year</button>
        <button>Max Relase Year</button>
        <button>Order by</button>
        <button>Order type: asc, desc</button>
        <button className="dropbutton" onClick={handleApplyFilters}>
              Aplicar Filtros
            </button>
        <input type='text' placeholder='Buscar película... (sin filtros)' value={searchFieldText} onChange={handleSearchChange} className='search-textfield'></input>
        <button onClick={handleSearchMovies}>Buscar</button>
      </div>

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="movie-card" key={index} onClick={() => handleCardClick(movie)}>
              <img src={movie.poster} alt={movie.title} />
              <div className="card-content">
                <h3 className="card-title">{movie.title}</h3>
                {/*<p className="card-description">{movie.description}</p>*/}
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

      {isMenuVisible && <div className="overlay" onClick={() => setIsMenuVisible(false)}></div>}

      {isMenuVisible && selectedMovie && (
        <div className="floating-menu">
          <button className="close-button" onClick={() => setIsMenuVisible(false)}>X</button>
          <h2>{selectedMovie.title}</h2>
          <img src={selectedMovie.poster} alt={selectedMovie.title} />
          <p>{selectedMovie.description || "Descripción no disponible"}</p>
          <p>Géneros: {Array.isArray(selectedMovie.genres) ? selectedMovie.genres.join(", ") : selectedMovie.genres}</p>
          <p>Rating: {selectedMovie.rating || "No disponible"}</p>
        </div>
      )}

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
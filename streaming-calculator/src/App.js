import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';

function App() {
  const [title, setTitle] = useState(''); // Estado para almacenar el título
  const [movies, setMovies] = useState([]); // Estado para almacenar las películas

  useEffect(() => {
    async function fetchData() {
      const data = await api.getData(); // Llama a la función getData
      setTitle(data); // Actualiza el estado con el título
    }
    fetchData();

    async function fetchMovies() {
      const movieData = await api.getShows(); // Llama a la función getShows
      setMovies(movieData); // Actualiza el estado con las películas
    }
    fetchMovies();
  }, []); // Ejecuta solo una vez al montar el componente

  return (
    <div className="App">
      <header className="App-header">
        <h1>Información de la Película</h1>
        {title ? <p>{title}</p> : <p>Cargando...</p>} {/* Muestra el título o un mensaje de carga */}
      </header>
      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div className="card" key={index}>
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
    </div>
  );
}

export default App;
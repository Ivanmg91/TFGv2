import React from 'react';

const MoviesGrid = ({ movies, handleCardClick, hasMore }) => {
  return (
    <div className="movie-grid">
      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <div className="movie-card" key={index} onClick={() => handleCardClick(movie)}>
            <img src={movie.poster} alt={movie.title} />
            <div className="card-content">
              <h3 className="card-title">{movie.title}</h3>
              <p className="card-genres">
                {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
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
  );
};

export default MoviesGrid;
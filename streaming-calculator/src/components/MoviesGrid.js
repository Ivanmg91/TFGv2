import React from 'react';
import { useNavigate } from 'react-router-dom';

const MoviesGrid = ({ movies, hasMore, loading }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-grid">
      {loading ? (
        Array.from({ length: 8 }).map((_, idx) => (
          <div className="skeleton-card" key={idx}>
            <div className="skeleton-poster"></div>
            <div className="skeleton-title"></div>
            <div className="skeleton-genres"></div>
          </div>
        ))
      ) : movies.length > 0 ? (
        movies.map((movie, index) => (
          <div className="movie-card" key={index} onClick={() => navigate('/info', { state: { movie } })}>
            <img src={movie.poster} alt={movie.title} />
            <div className="card-content">
              <h3 className="card-title">{movie.title}</h3>
              <p className="card-genres">
                {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default MoviesGrid;
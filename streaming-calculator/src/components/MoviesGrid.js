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
          </div>
        ))
      ) : movies.length > 0 ? (
        movies.map((movie, index) => (
          <div className="movie-card" key={index} onClick={() => {window.scrollTo(0, 0); navigate('/info', { state: { movie } })}}>
            <img src={movie.poster} alt={movie.title} />
          </div>
        ))
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default MoviesGrid;
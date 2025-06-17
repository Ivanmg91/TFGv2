import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MoviesRow = ({ movies, hasMore, loading }) => {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // update arrows visibility
  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // Detecta si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // put the scroll at the start of the row
  useEffect(() => {
    const scrollToStart = () => {
      if (rowRef.current) rowRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    };

    updateArrows();
    const el = rowRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    window.addEventListener('scrollAllRowsToStart', scrollToStart);

    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
      window.removeEventListener('scrollAllRowsToStart', scrollToStart);
    };
  }, [movies, loading]);

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-row-container">
      {!isMobile && showLeftArrow && (
        <div className="movie-row-shadow left" onClick={scrollLeft}>
          <span className="arrow">&#8592;</span>
        </div>
      )}
      <div className="movie-row" ref={rowRef}>
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <div className="skeleton-card" key={idx}>
              <div className="skeleton-poster"></div>
            </div>
          ))
        ) : movies.length > 0 ? (
          movies.map((movie, index) => (
            <div
              className="movie-card"
              key={index}
              onClick={() => {
                window.scrollTo(0, 0);
                // Emitir evento global para que todas las filas hagan scroll al inicio
                window.dispatchEvent(new Event('scrollAllRowsToStart'));
                navigate('/info', { state: { movie } });
              }}
            >
              <img src={movie.poster} alt={movie.title} />
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
      {!isMobile && showRightArrow && (
        <div className="movie-row-shadow right" onClick={scrollRight}>
          <span className="arrow">&#8594;</span>
        </div>
      )}
    </div>
  );
};

export default MoviesRow;
import React from 'react';
import * as api from '../api.js';
import { useEffect } from 'react';

const PaginationButtons = ({
  cursor,
  setCursor,
  hasMore,
  setHasMore,
  setMovies,
  prevCursors,
  setPrevCursors,
  selectedGenres,
  selectedPlatforms,
  selectedShowTypes,
  isMenuVisible,

  sliderValues,
  selectedOrderBy,
  selectedOrderType,

}) => {

  // Función para manejar la página siguiente
  const handleNextPage = async () => {
    if (!hasMore) return;
    const result = await api.getShowsByFilters(cursor, selectedGenres, selectedPlatforms, selectedShowTypes, sliderValues.minRating * 10, sliderValues.maxRating * 10, sliderValues.minRelase, sliderValues.maxRelase, selectedOrderBy, selectedOrderType);
    setPrevCursors((prev) => [...prev, cursor]);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para manejar la página anterior
  const handlePrevPage = async () => {
    if (prevCursors.length === 0) return;
    const prevCursor = prevCursors[prevCursors.length - 2];
    const result = await api.getShowsByFilters(prevCursor, selectedGenres, selectedPlatforms, selectedShowTypes, sliderValues.minRating * 10, sliderValues.maxRating * 10, sliderValues.minRelase, sliderValues.maxRelase, selectedOrderBy, selectedOrderType);
    setPrevCursors((prev) => prev.slice(0, -1));
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bloquear scroll del body cuando el menú está visible
  useEffect(() => {
    if (isMenuVisible) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    // Limpieza por si el componente se desmonta
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuVisible]);

  return (
    <>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={prevCursors.length === 0}>
          Anterior
        </button>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Siguiente
        </button>
      </div>
    </>
  );
};

export default PaginationButtons;
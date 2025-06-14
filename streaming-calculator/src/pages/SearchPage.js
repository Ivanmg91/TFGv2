import React, { useState, useEffect } from 'react';
import * as api from '../api.js';
import PaginationButtons from '../components/PaginationButtons.js';
import MoviesGrid from '../components/MoviesGrid.js';


function SearchPage({ searchText }) {
  const actualYear = new Date().getFullYear();
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const [selectedGenres] = useState([]);
  const [selectedPlatforms] = useState([]);
  const [selectedShowTypes] = useState([]);
  const [selectedMovie] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [minRating] = useState(0);
  const [maxRating] = useState(10);
  const [minRelase] = useState(1900);
  const [maxRelase] = useState(actualYear);
  const [sliderValues, setSliderValues] = useState({
    minRating: 0,
    maxRating: 10,
    minRelase: 2000,
    maxRelase: 2025,
  });
  const [selectedOrderBy, setSelectedOrderBy] = useState();
  const [selectedOrderType, setSelectedOrderType] = useState();
  const [loading, setLoading] = useState(true);

  // if textfield is not empty search with title else show top shows
  useEffect(() => {
    if (searchText && searchText.trim()) {
      fetchMoviesBySearch(searchText);
    } else {
      fetchInitialMovies();
    }
  }, [searchText]);

  // function for search with title
  async function fetchMoviesBySearch(text) {
    setLoading(true);
    const result = await api.getShowsByTitle(text);
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
    setLoading(false);
  }

  // fetch first shows
  async function fetchInitialMovies() {
    setLoading(true);
    const result = await api.getTopShows();
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
    setLoading(false);
  }

  return (
    <div style={{ marginTop: '100px' }}>
      <MoviesGrid
        movies={movies}
        hasMore={hasMore}
        loading={loading}
      />

      <PaginationButtons
        cursor={cursor}
        setCursor={setCursor}
        hasMore={hasMore}
        setHasMore={setHasMore}
        setMovies={setMovies}
        prevCursors={prevCursors}
        setPrevCursors={setPrevCursors}
        selectedGenres={selectedGenres}
        selectedPlatforms={selectedPlatforms}
        selectedShowTypes={selectedShowTypes}
        isMenuVisible={isMenuVisible}
        setIsMenuVisible={setIsMenuVisible}
        selectedMovie={selectedMovie}
        minRating={minRating}
        maxRating={maxRating}
        minRelase={minRelase}
        maxRelase={maxRelase}
        sliderValues={sliderValues}
        setSliderValues={setSliderValues}
        selectedOrderBy={selectedOrderBy}
        setSelectedOrdeyBy={setSelectedOrderBy}
        selectedOrderType={selectedOrderType}
        setSelectedOrdeyType={setSelectedOrderType}
      />
    </div>
  );
}

export default SearchPage;
import React, { useState, useEffect } from 'react';
import * as api from '../api.js';
import FiltersRow from '../components/FiltersRow/FiltersRow.js';
import PaginationButtons from '../components/PaginationButtons.js';
import MoviesGrid from '../components/MoviesGrid.js';


function DiscoverPage() {
  const actualYear = new Date().getFullYear();
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedShowTypes, setSelectedShowTypes] = useState([]);
  const [selectedMovie] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(10);
  const [minRelase, setMinRelase] = useState(1900);
  const [maxRelase, setMaxRelase] = useState(actualYear);
  const [sliderValues, setSliderValues] = useState({
    minRating: 0,
    maxRating: 10,
    minRelase: 2000,
    maxRelase: 2025,
  });
  const [selectedOrderBy, setSelectedOrderBy] = useState();
  const [selectedOrderType, setSelectedOrderType] = useState();
  const [loading, setLoading] = useState(true);
  const [selectedAndOr, setSelectedAndOr] = useState();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  async function fetchInitialMovies() {
    setLoading(true);
    const result = await api.getTopShows();
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
    setLoading(false);
  }

  return (
    <div className="discover-page">
      {isMobile && (
        <div className="filters-drawer">
          <FiltersRow
            setMovies={setMovies}
            setCursor={setCursor}
            setPrevCursors={setPrevCursors}
            setHasMore={setHasMore}
            setSelectedGenres={setSelectedGenres}
            setSelectedPlatforms={setSelectedPlatforms}
            setSelectedShowTypes={setSelectedShowTypes}
            minRating={minRating}
            setMinRating={setMinRating}
            maxRating={maxRating}
            setMaxRating={setMaxRating}
            minRelase={minRelase}
            setMinRelase={setMinRelase}
            maxRelase={maxRelase}
            setMaxRelase={setMaxRelase}
            sliderValues={sliderValues}
            setSliderValues={setSliderValues}
            setSelectedOrderBy={setSelectedOrderBy}
            setSelectedOrderType={setSelectedOrderType}
            setLoading={setLoading}
            setSelectedAndOr={setSelectedAndOr}
          />
        </div>
      )}

      {!isMobile && (
        <div className="filters-row-desktop">
          <FiltersRow
            setMovies={setMovies}
            setCursor={setCursor}
            setPrevCursors={setPrevCursors}
            setHasMore={setHasMore}
            setSelectedGenres={setSelectedGenres}
            setSelectedPlatforms={setSelectedPlatforms}
            setSelectedShowTypes={setSelectedShowTypes}
            minRating={minRating}
            setMinRating={setMinRating}
            maxRating={maxRating}
            setMaxRating={setMaxRating}
            minRelase={minRelase}
            setMinRelase={setMinRelase}
            maxRelase={maxRelase}
            setMaxRelase={setMaxRelase}
            sliderValues={sliderValues}
            setSliderValues={setSliderValues}
            setSelectedOrderBy={setSelectedOrderBy}
            setSelectedOrderType={setSelectedOrderType}
            setLoading={setLoading}
            setSelectedAndOr={setSelectedAndOr}
          />
        </div>
      )}

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
        selectedAndOr={selectedAndOr}
      />
    </div>
  );
}

export default DiscoverPage;
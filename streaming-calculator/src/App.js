import React, { useState, useEffect } from 'react';
import './App.css';
import * as api from './api.js';
import FiltersRow from './components/FiltersRow.js';
import PaginationButtons from './components/PaginationButtons.js';
import MoviesGrid from './components/MoviesGrid.js';


function App() {
  const actualYear = new Date().getFullYear();
  const [movies, setMovies] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [prevCursors, setPrevCursors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedShowTypes, setSelectedShowTypes] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
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

  useEffect(() => {
    fetchInitialMovies();
  }, []);

  async function fetchInitialMovies() {
    const result = await api.getTopShows();
    setMovies(result.movies);
    setHasMore(result.hasMore);
    setCursor(result.nextCursor);
  }

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
    setIsMenuVisible(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Streaming Calculator</h1>
      </header>

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
      />

      <MoviesGrid
        movies={movies}
        handleCardClick={handleCardClick}
        hasMore={hasMore}
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
      />
    </div>
  );
}

export default App;
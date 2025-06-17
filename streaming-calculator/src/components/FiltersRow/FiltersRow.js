import React, { useState, useRef, useEffect } from 'react';
import './FiltersRow.css';
import * as api from '../../api.js';
import RatingSlider from '../RatingSlider/RatingSlider.js';
import RelaseSlider from '../RelaseSlider/RelaseSlider.js';

const FiltersRow = ({
  setMovies, 
  setCursor, 
  setPrevCursors, 
  setHasMore, 
  setSelectedGenres, 
  setSelectedPlatforms, 
  setSelectedShowTypes, 
  minRating, 
  setMinRating, 
  maxRating, 
  setMaxRating,
  minRelase, 
  setMinRelase, 
  maxRelase, 
  setMaxRelase,
  sliderValues,
  setSliderValues,
  setSelectedOrderBy,
  setSelectedOrderType,
  setLoading,
  setSelectedAndOr
}) => {
  const actualYear = new Date().getFullYear();
  
  // Estados locales para los filtros
  const [localPlatforms, setLocalPlatforms] = useState([]);
  const [localGenres, setLocalGenres] = useState([]);
  const [localShowTypes, setLocalShowTypes] = useState([]);
  const [localAndOr, setLocalAndOr] = useState(false);
  const [localOrderBy, setLocalOrderBy] = useState(null);
  const [localOrderType, setLocalOrderType] = useState(null);

  // Handlers para checkboxes y radios
  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setLocalPlatforms(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };
  const handleGenreChange = (e) => {
    const value = e.target.value;
    setLocalGenres(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };
  const handleShowTypeChange = (e) => {
    const value = e.target.value;
    setLocalShowTypes(prev =>
      e.target.checked ? [...prev, value] : prev.filter(v => v !== value)
    );
  };
  const handleAndOrChange = (e) => {
    setLocalAndOr(e.target.checked);
  };
  const handleOrderByChange = (e) => {
    setLocalOrderBy(e.target.value);
  };
  const handleOrderTypeChange = (e) => {
    setLocalOrderType(e.target.value);
  };

  // Clear filters
  const handleClearPlatforms = () => setLocalPlatforms([]);
  const handleClearGenres = () => setLocalGenres([]);
  const handleClearShowTypes = () => setLocalShowTypes([]);
  const handleClearAndOr = () => setLocalAndOr(false);
  const handleClearOrderBy = () => setLocalOrderBy(null);
  const handleClearOrderType = () => setLocalOrderType(null);

  // Apply filters
    const handleApplyFilters = async () => {
      setLoading(true);    

      setSelectedGenres(localGenres);
      setSelectedPlatforms(localPlatforms);
      setSelectedShowTypes(localShowTypes);
      setSelectedAndOr(localAndOr ? "and" : "or");
      setSelectedOrderBy(localOrderBy);
      setSelectedOrderType(localOrderType);

      // Reset status to start from first page
      setCursor(null);
      setMovies([]);
      setPrevCursors([]);
    
      // Get shows with filters. Api call
      const result = await api.getShowsByFilters(null, localGenres, localPlatforms, localShowTypes,
        sliderValues.minRating * 10, sliderValues.maxRating * 10, sliderValues.minRelase, sliderValues.maxRelase, localOrderBy, localOrderType, localAndOr ? "and" : "or");
      setMovies(result.movies);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
  
      setLoading(false);
      handleClearAll();
    };

    // Clear all the filters
    const handleClearAll = () => {
      handleClearGenres();
      handleClearPlatforms();
      handleClearShowTypes();
      handleResetSliders();
      handleClearOrderBy();
      handleClearOrderType();
      handleClearAndOr();
    }


    // Control the max value
    const handleMinRatingChange = (value) => {
      if (value > maxRating) {
        setMinRating(maxRating);
        setSliderValues(prev => ({
          ...prev,
          minRating: maxRating
        }));
      } else {
        setMinRating(value);
        setSliderValues(prev => ({
          ...prev,
          minRating: value
        }));
      }
    };

    const handleMaxRatingChange = (value) => {
      if (value < minRating) {
        setMaxRating(minRating);
        setSliderValues(prev => ({
          ...prev,
          maxRating: minRating
        }));
      } else {
        setMaxRating(value);
        setSliderValues(prev => ({
          ...prev,
          maxRating: value
        }));
      }
    };

    const handleMinRelaseChange = (value) => {
      if (value > maxRelase) {
        setMinRelase(maxRelase);
        setSliderValues(prev => ({
          ...prev,
          minRelase: maxRelase
        }));
      } else {
        setMinRelase(value);
        setSliderValues(prev => ({
          ...prev,
          minRelase: value
        }));
      }
    };

    const handleMaxRelaseChange = (value) => {
      if (value < minRelase) {
        setMaxRelase(minRelase);
        setSliderValues(prev => ({
          ...prev,
          maxRelase: minRelase
        }));
      } else {
        setMaxRelase(value);
        setSliderValues(prev => ({
          ...prev,
          maxRelase: value
        }));
      }
    };

    const handleResetSliders = () => {
      setMinRating(0);
      setMaxRating(10);
      setMinRelase(1900);
      setMaxRelase(actualYear);
    }

    // Nuevo estado para el menú global
    const [openSection, setOpenSection] = useState(null);
    const globalDropdownRef = useRef(null);

    // Cerrar el menú global al hacer click fuera
    useEffect(() => {
      function handleClickOutside(event) {
        if (
          globalDropdownRef.current &&
          !globalDropdownRef.current.contains(event.target)
        ) {
          setOpenSection(null);
        }
      }
      if (openSection) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openSection]);

    return (
        <div className="filters-wrapper">
          <div className="filters-row">
            <span
              className='filters'
              // Al hacer click en "Filtros" cierra el menú global
              onClick={() => setOpenSection(null)}
            >
              &#x25BC;Filtros
            </span>
            {/* Botones de filtro que abren la sección correspondiente */}
            <button className="dropbutton" onClick={() => setOpenSection('platforms')}>Plataformas</button>
            <button className="dropbutton" onClick={() => setOpenSection('showtype')}>Películas/Series</button>
            <button className="dropbutton" onClick={() => setOpenSection('genres')}>Géneros</button>
            <button className="dropbutton" onClick={() => setOpenSection('minrating')}>RatingMin</button>
            <button className="dropbutton" onClick={() => setOpenSection('maxrating')}>RatingMáx</button>
            <button className="dropbutton" onClick={() => setOpenSection('minrelase')}>MinRelaseYear</button>
            <button className="dropbutton" onClick={() => setOpenSection('maxrelase')}>MáxRelaseYear</button>
            <button className="dropbutton" onClick={() => setOpenSection('orderby')}>OrdenarPor</button>
            <button className="dropbutton" onClick={() => setOpenSection('ordertype')}>SentidoAsc/Desc</button>
            <button className="dropbutton" onClick={handleApplyFilters}>Aplicar Filtros</button>
          </div>
          {/* Menú global desplegable */}
          {openSection && (
            <div
              className="dropdown-content-global"
              ref={globalDropdownRef}
            >
              {openSection === 'platforms' && (
                <>
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="netflix"
                      checked={localPlatforms.includes("netflix")}
                      onChange={handlePlatformChange}
                    />
                    Netflix
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="hbo"
                      checked={localPlatforms.includes("hbo")}
                      onChange={handlePlatformChange}
                    />
                    HBO
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="disney"
                      checked={localPlatforms.includes("disney")}
                      onChange={handlePlatformChange}
                    />
                    Disney
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="prime"
                      checked={localPlatforms.includes("prime")}
                      onChange={handlePlatformChange}
                    />
                    Prime
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="apple" 
                      checked={localPlatforms.includes("apple")}
                      onChange={handlePlatformChange}
                    />
                    Apple
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="mubi"
                      checked={localPlatforms.includes("mubi")}
                      onChange={handlePlatformChange}
                    />
                    Mubi
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="curiosity"
                      checked={localPlatforms.includes("curiosity")}
                      onChange={handlePlatformChange}
                    />
                    Curiosity
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="plutotv"
                      checked={localPlatforms.includes("plutotv")}
                      onChange={handlePlatformChange}
                    />
                    Pluto TV
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-platforms" value="zee5"
                      checked={localPlatforms.includes("zee5")}
                      onChange={handlePlatformChange}
                    />
                    Zee5
                  </label>

                  <button onClick={handleClearPlatforms}>
                    Quitar todos
                  </button>
                </>
              )}
              {openSection === 'showtype' && (
                <>
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-showtype" value="movie"
                      checked={localShowTypes.includes("movie")}
                      onChange={handleShowTypeChange}
                    />
                    Películas
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-showtype" value="series"
                      checked={localShowTypes.includes("series")}
                      onChange={handleShowTypeChange}
                    />
                    Series
                  </label>

                  <button onClick={handleClearGenres}>
                    Quitar todos
                  </button>
                </>
              )}
              {openSection === 'genres' && (
                <>
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="action"
                      checked={localGenres.includes("action")}
                      onChange={handleGenreChange}
                    />
                    Acción
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="adventure"
                      checked={localGenres.includes("adventure")}
                      onChange={handleGenreChange}
                    />
                    Aventura
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="animation"
                      checked={localGenres.includes("animation")}
                      onChange={handleGenreChange}
                    />
                    Animación
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="comedy"
                      checked={localGenres.includes("comedy")}
                      onChange={handleGenreChange}
                    />
                    Comedia
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="crime"  
                      checked={localGenres.includes("crime")}
                      onChange={handleGenreChange}
                    />
                    Crimen
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="documentary"
                      checked={localGenres.includes("documentary")}
                      onChange={handleGenreChange}
                    />
                    Documental
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="drama"
                      checked={localGenres.includes("drama")}
                      onChange={handleGenreChange}
                    />
                    Drama
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="family"
                      checked={localGenres.includes("family")}
                      onChange={handleGenreChange}
                    />
                    Familiar
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="fantasy"
                      checked={localGenres.includes("fantasy")}
                      onChange={handleGenreChange}
                    />
                    Fantasia
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="history"
                      checked={localGenres.includes("history")}
                      onChange={handleGenreChange}
                    />
                    Historia
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="horror"
                      checked={localGenres.includes("horror")}
                      onChange={handleGenreChange}
                    />
                    Horror
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="music"
                      checked={localGenres.includes("music")}
                      onChange={handleGenreChange}
                    />
                    Music
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="mystery"
                      checked={localGenres.includes("mystery")}
                      onChange={handleGenreChange}
                    />
                    Misterio
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="news"
                      checked={localGenres.includes("news")}
                      onChange={handleGenreChange}
                    />
                    Noticias
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="reality"
                      checked={localGenres.includes("reality")}
                      onChange={handleGenreChange}
                    />
                    Reality
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="romance"
                      checked={localGenres.includes("romance")}
                      onChange={handleGenreChange}
                    />
                    Romance
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="scifi"
                      checked={localGenres.includes("scifi")}
                      onChange={handleGenreChange}
                    />
                    Ciencia Ficción
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="talk"
                      checked={localGenres.includes("talk")}
                      onChange={handleGenreChange}
                    />
                    Entrevista
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="thriller"
                      checked={localGenres.includes("thriller")}
                      onChange={handleGenreChange}
                    />
                    Thriller
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="war"
                      checked={localGenres.includes("war")}
                      onChange={handleGenreChange}
                    />
                    Guerra
                  </label>
                  
                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-genres" value="western" /*al pulsar el boton hace handleclearfilters q los borra de la lista y como no estan en la lista de selectedgenres los desmarca*//>
                    Western
                  </label>

                  <label className="dropdown-option">
                    <input type="checkbox" name="dropdown-andor" value="and"
                      checked={localAndOr}
                      onChange={handleAndOrChange}
                    />
                    Que incluya todos los seleccionados?
                  </label> 

                  <button onClick={handleClearGenres}>
                    Quitar todos
                  </button>
                </>
              )}
              {openSection === 'minrating' && (
                <>
                  <RatingSlider value={minRating} onChange={handleMinRatingChange} max={maxRating} />
                  <button onClick={handleResetSliders}>
                    Resetear ratings
                  </button>
                </>
              )}
              {openSection === 'maxrating' && (
                <>
                  <RatingSlider value={maxRating} onChange={handleMaxRatingChange} min={minRating} />
                  <button onClick={handleResetSliders}>
                    Resetear ratings
                  </button>
                </>
              )}
              {openSection === 'minrelase' && (
                <>
                  <RelaseSlider value={minRelase} onChange={handleMinRelaseChange} max={maxRelase} />
                  <button onClick={handleResetSliders}>
                    Resetear ratings
                  </button>
                </>
              )}
              {openSection === 'maxrelase' && (
                <>
                  <RelaseSlider value={maxRelase} onChange={handleMaxRelaseChange} min={minRelase} />
                  <button onClick={handleResetSliders}>
                    Resetear ratings
                  </button>
                </>
              )}
              {openSection === 'orderby' && (
                <>
                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="original_title"
                      checked={localOrderBy === "original_title"}
                      onChange={handleOrderByChange}
                    />
                    Alfabéticamente por su titulo original
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="release_date"
                      checked={localOrderBy === "release_date"}
                      onChange={handleOrderByChange}
                    />
                    Fecha
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="rating"
                      checked={localOrderBy === "rating"}
                      onChange={handleOrderByChange}
                    />
                    Rating
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="popularity_alltime"
                      checked={localOrderBy === "popularity_alltime"}
                      onChange={handleOrderByChange}
                    />
                    Popularidad siempre
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="popularity_1year"  
                      checked={localOrderBy === "popularity_1year"}
                      onChange={handleOrderByChange}
                    />
                    Popularidad 1 año
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="popularity_1month"
                      checked={localOrderBy === "popularity_1month"}
                      onChange={handleOrderByChange}
                    />
                    Popularidad 1 mes
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-orderby" value="popularity_1week"
                      checked={localOrderBy === "popularity_1week"}
                      onChange={handleOrderByChange}
                    />
                    Popularidad 1 semana
                  </label>

                  <button onClick={handleClearOrderBy}>
                    Quitar
                  </button>
                </>
              )}
              {openSection === 'ordertype' && (
                <>
                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-ordertype" value="asc"
                      checked={localOrderType === "asc"}
                      onChange={handleOrderTypeChange}
                    />
                    Ascendente
                  </label>

                  <label className="dropdown-option">
                    <input type="radio" name="dropdown-ordertype" value="desc"
                      checked={localOrderType === "desc"}
                      onChange={handleOrderTypeChange}
                    />
                    Descendente
                  </label>

                  <button onClick={handleClearOrderType}>
                    Quitar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
    )
}

export default FiltersRow;
import React, { useState } from 'react';
import '../App.css';
import * as api from '../api.js';
import RatingSlider from './RatingSlider/RatingSlider.js';
import RelaseSlider from './RelaseSlider/RelaseSlider.js';

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
  setSliderValues
}) => {
  const [searchFieldText, setSearchText] = useState("");
  const actualYear = new Date().getFullYear();
  
  // Clear filters
  const handleClearPlatforms = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-platforms"]:checked');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Desmarcar cada checkbox
    });
  };

  // Clear filters
  const handleClearGenres = () => {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-genres"]:checked');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false; // Desmarcar cada checkbox
    });
  };

  // Apply filters
    const handleApplyFilters = async () => {
    
      // Actualizar la lista de géneros seleccionados
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-genres"]:checked');
      const selected = Array.from(checkboxes).map((checkbox) => checkbox.value);
      setSelectedGenres(selected); // Se borran los q estaban en la lista
  
      // Actualizar la lista de plataformas seleccionadas
      const checkboxesPlatforms = document.querySelectorAll('input[type="checkbox"][name="dropdown-platforms"]:checked');
      const selectedPlatforms = Array.from(checkboxesPlatforms).map((checkbox) => checkbox.value);
      setSelectedPlatforms(selectedPlatforms);
  
      // Actualizar la lista de showtypes seleccionados
      const checkboxesShowTypes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
      const selectedShowTypes = Array.from(checkboxesShowTypes).map((checkbox) => checkbox.value);
      setSelectedShowTypes(selectedShowTypes);

      // Restablecer el estado para comenzar desde la primera página
      setCursor(null);
      setMovies([]);
      setPrevCursors([]);
    
      // Obtener las películas con los filtros aplicados desde la primera página
      const result = await api.getShowsByFilters(null, selected, selectedPlatforms, selectedShowTypes, sliderValues.minRating * 10, sliderValues.maxRating * 10, sliderValues.minRelase, sliderValues.maxRelase);
      setMovies(result.movies);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
  
      handleClearAll();
    };

    // Clear all the filters
    const handleClearAll = () => {
      handleClearGenres();
      handleClearPlatforms();
      handleClearSearchText();
      handleClearShowTypes();
      handleResetSliders();
    }

    // Clear search text
    const handleClearSearchText = () => {
      setSearchText(""); // Vaciar el fieldtext
    };

    // Clear showtypes
    const handleClearShowTypes = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Desmarcar cada checkbox
      });
    };

    const handleSearchChange = (event) => {
      setSearchText(event.target.value);
    };
    
    // Search movies
    const handleSearchMovies = async () => {
      if (!searchFieldText.trim()) return; // Avoid empty searchs
      const result = await api.getShowsByTitle(searchFieldText);
      setMovies(result.movies);
      setHasMore(result.hasMore);
      setCursor(result.nextCursor);
      setPrevCursors([]); // Reset cursors
    
      handleClearAll();
    };

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

    return (
        <div className="filters-row">
          <text className='filters'>&#x25BC;Filtros</text>
          <div className='dropdown'>
            <label class="dropbutton">Plataformas</label>
            <div className='dropdown-content'>
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="netflix" />
                Netflix
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="hbo" />
                HBO
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="disney" />
                Disney
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="prime" />
                Prime
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="apple"  />
                Apple
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="mubi" />
                Mubi
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="curiosity" />
                Curiosity
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="plutotv" />
                Pluto TV
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-platforms" value="zee5"/>
                Zee5
              </label>

              <button onClick={handleClearPlatforms}>
                Quitar todos
              </button>
            </div>
          </div>
          <div className='dropdown'>
            <label class="dropbutton">Películas/Series</label>
            <div className='dropdown-content'>
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-showtype" value="movie" />
                Películas
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-showtype" value="series" />
                Series
              </label>

              <button onClick={handleClearGenres}>
                Quitar todos
              </button>
            </div>
          </div>
          <div className='dropdown'>
            <label class="dropbutton">Generos</label>
            <div className='dropdown-content'>
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="action" />
                Acción
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="adventure" />
                Aventura
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="animation" />
                Animación
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="comedy" />
                Comedia
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="crime"  />
                Crimen
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="documentary" />
                Documental
              </label>

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="drama" />
                Drama
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="family" />
                Familiar
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="fantasy"/>
                Fantasia
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="history" />
                Historia
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="horror" />
                Horror
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="music" />
                Music
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="mystery" />
                Misterio
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="news" />
                Noticias
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="reality" />
                Reality
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="romance" />
                Romance
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="scifi" />
                Ciencia Ficción
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="talk" />
                Entrevista
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="thriller" />
                Thriller
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="war" />
                Guerra
              </label>
              
              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-genres" value="western" /*al pulsar el boton hace handleclearfilters q los borra de la lista y como no estan en la lista de selectedgenres los desmarca*//>
                Western
              </label> 

              <button onClick={handleClearGenres}>
                Quitar todos
              </button>
            </div>
          </div>
          
          <div className="dropdown">
            <label className="dropbutton">Rating Min</label>
            <div className="dropdown-content">
              <RatingSlider value={minRating} onChange={handleMinRatingChange} max={maxRating} />
              <button onClick={handleResetSliders}>
                Resetear ratings
              </button>
            </div>
          </div>
          <div className="dropdown">
            <label className="dropbutton">Rating Máx</label>
            <div className="dropdown-content">
              <RatingSlider value={maxRating} onChange={handleMaxRatingChange} min={minRating} />
              <button onClick={handleResetSliders}>
                Resetear ratings
              </button>
            </div>
          </div>
          <div className="dropdown">
            <label className="dropbutton">Min Relase Year</label>
            <div className="dropdown-content">
              <RelaseSlider value={minRelase} onChange={handleMinRelaseChange} max={maxRelase} />
              <button onClick={handleResetSliders}>
                Resetear ratings
              </button>
            </div>
          </div>
          <div className="dropdown">
            <label className="dropbutton">Máx Relase Year</label>
            <div className="dropdown-content">
              <RelaseSlider value={maxRelase} onChange={handleMaxRelaseChange} min={minRelase} />
              <button onClick={handleResetSliders}>
                Resetear ratings
              </button>
            </div>
          </div>
          <button>Order by</button>
          <button>Order type: asc, desc</button>
          <button className="dropbutton" onClick={handleApplyFilters}>
                Aplicar Filtros
              </button>
          <input type='text' placeholder='Buscar película... (sin filtros)' value={searchFieldText} onChange={handleSearchChange} className='search-textfield'></input>
          <button onClick={handleSearchMovies}>Buscar</button>
        </div>
    )
}

export default FiltersRow;
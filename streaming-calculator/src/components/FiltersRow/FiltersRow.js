import React from 'react';
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

  // Clear filters
  const handleClearOrderBy = () => {
    const radios = document.querySelectorAll('input[type="radio"][name="dropdown-orderby"]:checked');
    radios.forEach((radio) => {
      radio.checked = false; // Desmarcar cada checkbox
    });
  };

  // Clear filters
  const handleClearOrderType = () => {
    const radios = document.querySelectorAll('input[type="radio"][name="dropdown-ordertype"]:checked');
    radios.forEach((radio) => {
      radio.checked = false; // Desmarcar cada checkbox
    });
  };

  // Apply filters
    const handleApplyFilters = async () => {
      setLoading(true);    

      // Update genres list
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-genres"]:checked');
      const selected = Array.from(checkboxes).map((checkbox) => checkbox.value);
      setSelectedGenres(selected); // Those that were on the list are deleted

      // Update andor, It is to know if you want them to contain all the genres or some
      const andOrChecked = document.querySelector('input[type="checkbox"][name="dropdown-andor"]').checked;
      const genresRelation = andOrChecked ? "and" : "or";
      setSelectedAndOr(genresRelation);
  
      // update platforms list
      const checkboxesPlatforms = document.querySelectorAll('input[type="checkbox"][name="dropdown-platforms"]:checked');
      const selectedPlatforms = Array.from(checkboxesPlatforms).map((checkbox) => checkbox.value);
      setSelectedPlatforms(selectedPlatforms);
  
      // Update showtype list
      const checkboxesShowTypes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
      const selectedShowTypes = Array.from(checkboxesShowTypes).map((checkbox) => checkbox.value);
      setSelectedShowTypes(selectedShowTypes);

      // update orderby
      const orderByOption = document.querySelector('input[type="radio"][name="dropdown-orderby"]:checked')?.value || null;
      setSelectedOrderBy(orderByOption);

      // update ordertype (asc or desc)
      const orderByType = document.querySelector('input[type="radio"][name="dropdown-ordertype"]:checked')?.value || null;
      setSelectedOrderType(orderByType);

      // Reset status to start from first page
      setCursor(null);
      setMovies([]);
      setPrevCursors([]);
    
      // Get shows with filters. Api call
      const result = await api.getShowsByFilters(null, selected, selectedPlatforms, selectedShowTypes,
        sliderValues.minRating * 10, sliderValues.maxRating * 10, sliderValues.minRelase, sliderValues.maxRelase, orderByOption, orderByType, genresRelation);
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


    // Clear showtypes
    const handleClearShowTypes = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-showtype"]:checked');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Desmarcar cada checkbox
      });
    };

    // Clear showtypes
    const handleClearAndOr = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="dropdown-andor"]:checked');
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false; // Desmarcar cada checkbox
      });
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

              <label class="dropdown-option">
                <input type="checkbox" name="dropdown-andor" value="and" />
                Que incluya todos los seleccionados?
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
          <div className='dropdown'>
            <label class="dropbutton">Ordenar por</label>
            <div className='dropdown-content'>
              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="original_title" />
                Alfabéticamente por su titulo original
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="release_date" />
                Fecha
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="rating" />
                Rating
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="popularity_alltime" />
                Popularidad siempre
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="popularity_1year"  />
                Popularidad 1 año
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="popularity_1month" />
                Popularidad 1 mes
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-orderby" value="popularity_1week" />
                Popularidad 1 semana
              </label>

              <button onClick={handleClearOrderBy}>
                Quitar
              </button>
            </div>
          </div>
          <div className='dropdown'>
            <label class="dropbutton">Sentido asc/desc</label>
            <div className='dropdown-content'>
              <label class="dropdown-option">
                <input type="radio" name="dropdown-ordertype" value="asc" />
                Ascendente
              </label>

              <label class="dropdown-option">
                <input type="radio" name="dropdown-ordertype" value="desc" />
                Descendente
              </label>

              <button onClick={handleClearOrderType}>
                Quitar
              </button>
            </div>
          </div>
          <button className="dropbutton" onClick={handleApplyFilters}>
                Aplicar Filtros
              </button>
        </div>
    )
}

export default FiltersRow;
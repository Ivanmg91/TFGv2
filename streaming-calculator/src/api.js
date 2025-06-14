import * as streamingAvailability from "streaming-availability";
import './App.js';

const RAPID_API_KEY = "23a087e865msh24b5530ee4ccf2dp1c50b3jsn8521212f4dcb";
const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
  apiKey: RAPID_API_KEY
}));

const actualYear = new Date().getFullYear();

// To translate somethings
/*async function traducirTextoGoogleRapidApi(texto, source, target) {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': 'af2469ec88msh6b559a4140ac497p19de27jsn094c3d8b6fb0',
      'X-RapidAPI-Host': 'google-api31.p.rapidapi.com'
    },
    body: JSON.stringify({
      text: texto,
      to: target,
      from_lang: source
    })
  };

  const response = await fetch('https://google-api31.p.rapidapi.com/gtranslate', options);
  const data = await response.json();

  console.log('Respuesta completa:', data);

  if (data && data.translated_text) {
    return data.translated_text;
  } else {
    throw new Error('No se pudo obtener la traducción. Respuesta API: ' + JSON.stringify(data));
  }
}

// Ejemplo de uso:
traducirTextoGoogleRapidApi('Hola mundo', 'es', 'en')
  .then(traduccion => console.log('Traducción:', traduccion))
  .catch(err => console.error('Error:', err));
*/

// To translate genres
const genreTranslations = {
  "Action": "Acción",
  "Adventure": "Aventura",
  "Animation": "Animación",
  "Comedy": "Comedia",
  "Crime": "Crimen",
  "Documentary": "Documental",
  "Drama": "Drama",
  "Family": "Familiar",
  "Fantasy": "Fantasía",
  "History": "Historia",
  "Horror": "Terror",
  "Music": "Música",
  "Mystery": "Misterio",
  "Romance": "Romance",
  "Science Fiction": "Ciencia ficción",
  "TV Movie": "Película de TV",
  "Thriller": "Suspenso",
  "War": "Guerra",
  "Western": "Occidental"
};

function obtenerIdiomasDeStreaming(movie) {
  const audiosSet = new Set();

  Object.values(movie.streamingOptions).forEach(option => {
    (Array.isArray(option) ? option : [option]).forEach(opt => {
      if (opt.audios) {
        opt.audios.forEach(audio => {
          // Si audio es string, añade directamente
          if (typeof audio === "string") {
            audiosSet.add(audio);
          } else if (audio.language) {
            // Si es objeto, añade solo el código de idioma
            audiosSet.add(audio.language);
          }
        });
      }
    });
  });

  return {
    audios: Array.from(audiosSet)
  };
}

export function obtenerAudiosDeOpcion(option) {
  const audiosSet = new Set();
  if (option.audios) {
    option.audios.forEach(audio => {
      if (typeof audio === "string") {
        audiosSet.add(audio);
      } else if (audio.language) {
        audiosSet.add(audio.language);
      }
    });
  }
  return Array.from(audiosSet);
}

export function obtenerSubtitulosDeOpcion(option) {
  const subsSet = new Set();
  if (option.subtitles) {
    option.subtitles.forEach(sub => {
      // Caso correcto para tu API:
      if (sub.locale && sub.locale.language) {
        subsSet.add(sub.locale.language);
      } else if (typeof sub === "string") {
        subsSet.add(sub);
      } else if (sub.language) {
        subsSet.add(sub.language);
      }
    });
  }
  return Array.from(subsSet);
}

function obtenerPrimerLightThemeImage(streamingOptions) {
  if (!streamingOptions) return '';
  for (const option of Object.values(streamingOptions)) {
    const opts = Array.isArray(option) ? option : [option];
    for (const opt of opts) {
      if (opt.service && opt.service.imageSet && opt.service.imageSet.lightThemeImage) {
        return opt.service.imageSet.lightThemeImage;
      }
    }
  }
  return '';
}


export async function getData() {
  const data = await client.showsApi.getShow({
    id: "tt0068646",
    country: "es",
    outputLanguage: "es"
  });
  return data.title;
}

// Get shows using filters
export async function getShowsByFilters(cursor = null, selectedGenres = [], selectedPlatforms = [], selectedShowTypes = [],
   minRating = 0, maxRatin = 10, minRelase = 1900, maxRelase = actualYear, orderBy, orderType, genresRelation = "or") {
    // Making the search
  const response = await client.showsApi.searchShowsByFilters({
    country: "es",
    genres: selectedGenres,
    cursor: cursor,
    catalogs: selectedPlatforms,
    showType: selectedShowTypes.length === 1 ? selectedShowTypes : null,
    outputLanguage: "es",
    ratingMin: minRating,
    ratingMax: maxRatin,
    yearMin: minRelase,
    yearMax: maxRelase,
    orderBy: orderBy,
    orderDirection: orderType,
    genresRelation: genresRelation,

  });

  // obtaining the result
  const movies = response.shows.map(movie => ({
    id: movie.id,
    title: movie.title || "Título no disponible",
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    overview: movie.overview || 'Sin descripción disponible',
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: movie.releaseYear || movie.firstAirYear || "Año no disponible",
    directors: movie.directors || movie.creators || [],
    cast: movie.cast || [],
    rating: movie.rating || "Sin calificación",
    runtime: (typeof movie.runtime === "number" && movie.runtime > 0)
  ? movie.runtime + " min"
  : (movie.seasonCount
      ? `${movie.seasonCount} temporada(s)` + (movie.episodeCount ? `, ${movie.episodeCount} episodio(s)` : '')
      : (movie.episodeCount
          ? `${movie.episodeCount} episodio(s)`
          : "Duración no disponible")
    ),
    streamingOptions: movie.streamingOptions || {},
    languages: obtenerIdiomasDeStreaming(movie),
    lightThemeImage: obtenerPrimerLightThemeImage(movie.streamingOptions),
    showType: movie.showType,
  }));
  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

export async function getTopShows(cursor = null) {
  let random = Math.floor(Math.random() * 5);
  let randomService = "";
  switch (random) {
    case 0:
      randomService = "netflix";
      break;
    
    case 1:
      randomService = "hbo";
      break;
  
    case 2:
      randomService = "disney";
      break;  

    case 3:
      randomService = "prime";
      break;
    
    case 4:
      randomService = "apple";
      break;

    case 5:
      randomService = "mubi";
      break;
    
    case 6:
      randomService = "curiosity";
      break;
  
    case 7:
      randomService = "plutotv";
      break;  

    case 8:
      randomService = "zee5";
      break;
    
    default:
      randomService = "netflix";
  }

  const response = await client.showsApi.getTopShows({
    country: "es",
    cursor: cursor,
    outputLanguage: "es",
    service: randomService,
  });

  const movies = response.map(movie => ({
    id: movie.id,
    title: movie.title || "Título no disponible",
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    overview: movie.overview || 'Sin descripción disponible',
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: movie.releaseYear || movie.firstAirYear  || "Año no disponible",
    directors: movie.directors || movie.creators  || [],
    cast: movie.cast || [],
    rating: movie.rating || "Sin calificación",
    runtime: (typeof movie.runtime === "number" && movie.runtime > 0)
  ? movie.runtime + " min"
  : (movie.seasonCount
      ? `${movie.seasonCount} temporada(s)` + (movie.episodeCount ? `, ${movie.episodeCount} episodio(s)` : '')
      : (movie.episodeCount
          ? `${movie.episodeCount} episodio(s)`
          : "Duración no disponible")
    ),
    streamingOptions: movie.streamingOptions || {},
    languages: obtenerIdiomasDeStreaming(movie),
    lightThemeImage: obtenerPrimerLightThemeImage(movie.streamingOptions),
    showType: movie.showType,
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

export async function getTopShowsNoRandom(service, showType, cursor = null) {
  const response = await client.showsApi.getTopShows({
    country: "es",
    cursor: cursor,
    outputLanguage: "es",
    service: service,
    showType: showType,
  });

  const movies = response.map(movie => ({
    id: movie.id,
    title: movie.title || "Título no disponible",
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    overview: movie.overview || 'Sin descripción disponible',
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: movie.releaseYear || movie.firstAirYear  || "Año no disponible",
    directors: movie.directors || movie.creators  || [],
    cast: movie.cast || [],
    rating: movie.rating || "Sin calificación",
    runtime: (typeof movie.runtime === "number" && movie.runtime > 0)
      ? movie.runtime + " min"
      : (movie.seasonCount
          ? `${movie.seasonCount} temporada(s)` + (movie.episodeCount ? `, ${movie.episodeCount} episodio(s)` : '')
          : (movie.episodeCount
              ? `${movie.episodeCount} episodio(s)`
              : "Duración no disponible")
        ),
    streamingOptions: movie.streamingOptions || {},
    languages: obtenerIdiomasDeStreaming(movie),
    lightThemeImage: obtenerPrimerLightThemeImage(movie.streamingOptions),
    showType: movie.showType,
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

export async function getShowsByTitle(title, cursor = null) {
  const response = await client.showsApi.searchShowsByTitle({
    title: title,
    country: "es",
    outputLanguage: "es",
    cursor: cursor,
  });

  const movies = (response.shows || response).map(movie => ({
    id: movie.id,
    title: movie.title || "Título no disponible",
    overview: movie.overview || 'Sin descripción disponible',
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: movie.imageSet?.horizontalPoster?.w1080 || '',
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: movie.releaseYear || movie.firstAirYear  || "Año no disponible",
    directors: movie.directors || movie.creators || [],
    cast: movie.cast || [],
    rating: movie.rating || "Sin calificación",
    runtime: (typeof movie.runtime === "number" && movie.runtime > 0)
  ? movie.runtime + " min"
  : (movie.seasonCount
      ? `${movie.seasonCount} temporada(s)` + (movie.episodeCount ? `, ${movie.episodeCount} episodio(s)` : '')
      : (movie.episodeCount
          ? `${movie.episodeCount} episodio(s)`
          : "Duración no disponible")
    ),
    streamingOptions: movie.streamingOptions || {},
    languages: obtenerIdiomasDeStreaming(movie),
    lightThemeImage: obtenerPrimerLightThemeImage(movie.streamingOptions),
    showType: movie.showType,
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

export async function getShowById(id) {
  const response = await client.showsApi.getShow({
    id,
    country: "es",
    outputLanguage: "es"
  });
  return {
    id: response.id,
    title: response.title || "Título no disponible",
    originalTitle: response.originalTitle || "Título original no disponible",
    poster: response.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: response.imageSet?.horizontalPoster?.w1080 || '',
    horizontalBackDrop: response.imageSet?.horizontalBackdrop?.w1080 || '',
    overview: response.overview || 'Sin descripción disponible',
    genres: response.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: response.releaseYear || response.firstAirYear || "Año no disponible",
    directors: response.directors || response.creators || [],
    cast: response.cast || [],
    rating: response.rating || "Sin calificación",
    runtime: (typeof response.runtime === "number" && response.runtime > 0)
      ? response.runtime + " min"
      : (response.seasonCount
          ? `${response.seasonCount} temporada(s)` + (response.episodeCount ? `, ${response.episodeCount} episodio(s)` : '')
          : (response.episodeCount
              ? `${response.episodeCount} episodio(s)`
              : "Duración no disponible")
        ),
    streamingOptions: response.streamingOptions || {},
    languages: obtenerIdiomasDeStreaming(response),
    lightThemeImage: obtenerPrimerLightThemeImage(response.streamingOptions),
    showType: response.showType,
  };
}
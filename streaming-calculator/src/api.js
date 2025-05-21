import * as streamingAvailability from "streaming-availability";
import './App.js';

const RAPID_API_KEY = "9f046801c3mshfca9ccfbf4cb559p1ac9f9jsnc0130eea4de9";
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

export async function getData() {
  const data = await client.showsApi.getShow({
    id: "tt0068646",
    country: "es",
  });
  return data.title;
}

export async function getShowsByFilters(cursor = null, selectedGenres = [], selectedPlatforms = [], selectedShowTypes = [], minRating = 0, maxRatin = 10, minRelase = 1900, maxRelase = actualYear, orderBy, orderType) {
  const response = await client.showsApi.searchShowsByFilters({
    country: "es",
    genres: selectedGenres,
    //orderBy: "popularity_1year", // Editar
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
  });

  const movies = response.shows.map(movie => ({
    title: movie.title,
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet.verticalPoster.w360, // There are different poster sizes 
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    description: movie.overview,
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    relaseYear: movie.releaseYear,
    rating: movie.rating,
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
    title: movie.title,
    poster: movie.imageSet.verticalPoster.w360, // There are different poster sizes 
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    description: movie.overview,
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
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
    cursor: cursor, // Añadir cursor para paginación
  });

  const movies = response.map(movie => ({
    title: movie.title || "Título no disponible",
    originalTitle: movie.originalTitle || "Título original no disponible",
    poster: movie.imageSet?.verticalPoster?.w480 || '',
    horizontalPoster: movie.imageSet.horizontalPoster.w1080,
    horizontalBackDrop: movie.imageSet?.horizontalBackdrop?.w1080 || '',
    description: movie.overview || 'Sin descripción disponible',
    genres: movie.genres.map(genre => genreTranslations[genre.name] || genre.name),
    releaseYear: movie.releaseYear || "Año no disponible",
    directors: movie.directors || [],
    cast: movie.cast || [],
    rating: movie.rating || "Sin calificación",
    runtime: movie.runtime || "Duración no disponible",
    streamingOptions: movie.streamingOptions || {},
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}
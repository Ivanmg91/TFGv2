import * as streamingAvailability from "streaming-availability";
import './App.js';

const RAPID_API_KEY = "af2469ec88msh6b559a4140ac497p19de27jsn094c3d8b6fb0";
const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
  apiKey: RAPID_API_KEY
}));

export async function getData() {
  const data = await client.showsApi.getShow({
    id: "tt0068646",
    country: "us",
  });
  return data.originalTitle;
}

export async function getShows(cursor = null, selectedGenres = []) {
  const response = await client.showsApi.searchShowsByFilters({
    country: "es",
    genres: selectedGenres,
    orderBy: "popularity_1year",
    cursor: cursor,
    outputLanguage: "es",
  });

  const movies = response.shows.map(movie => ({
    title: movie.originalTitle,
    poster: movie.imageSet.verticalPoster.w360,
    description: movie.overview,
    genres: movie.genres.map(genre => genre.name),
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

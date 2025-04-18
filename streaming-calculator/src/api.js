import * as streamingAvailability from "streaming-availability";

const RAPID_API_KEY = "e073b530e0msh5a489d58ded6fe2p167d0cjsn6e3a9bca4a92";
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

export async function getShows(cursor = null) {
  const response = await client.showsApi.searchShowsByFilters({
    country: "us",
    catalogs: ["netflix"],
    genres: ["action"],
    showType: streamingAvailability.ShowType.Movie,
    orderBy: "popularity_1year",
    cursor: cursor,
    outputLanguage: "es",
  });

  const movies = response.shows.map(movie => ({
    title: movie.originalTitle,
    poster: movie.posterPath,
    description: movie.overview,
  }));

  return {
    movies,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor,
  };
}

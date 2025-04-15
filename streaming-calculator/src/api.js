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
    return data.originalTitle; // Retorna el título original
}

export async function getShows() {
    const RAPID_API_KEY = "e073b530e0msh5a489d58ded6fe2p167d0cjsn6e3a9bca4a92";
    const PAGES_TO_FETCH = 1;

    const client = new streamingAvailability.Client(new streamingAvailability.Configuration({
        apiKey: RAPID_API_KEY
    }));

    const movies = client.showsApi.searchShowsByFiltersWithAutoPagination({
        country: "us",
        catalogs: ["netflix"],
        genres: ["action"],
        showType: streamingAvailability.ShowType.Movie,
        orderBy: "popularity_1year",
    }, 3)


    const showsList = [];
    for await (const movie of movies) {
        showsList.push({
            title: movie.originalTitle,
            poster: movie.posterPath, // Ruta del póster
            description: movie.overview, // Descripción de la película
        });
    }
    return showsList;
}
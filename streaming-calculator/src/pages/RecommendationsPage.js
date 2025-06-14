import React, { useEffect, useState } from 'react';
import MoviesRow from '../components/MoviesRow.js';
import * as api from '../api.js';

function RecommendationsPage() {
  // Estados separados para películas y series de cada plataforma
  const [netflixMovies, setNetflixMovies] = useState([]);
  const [netflixSeries, setNetflixSeries] = useState([]);
  const [hboMovies, setHboMovies] = useState([]);
  const [hboSeries, setHboSeries] = useState([]);
  const [disneyMovies, setDisneyMovies] = useState([]);
  const [disneySeries, setDisneySeries] = useState([]);
  const [primeMovies, setPrimeMovies] = useState([]);
  const [primeSeries, setPrimeSeries] = useState([]);
  const [appleMovies, setAppleMovies] = useState([]);
  const [appleSeries, setAppleSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      // Traer películas y series por separado
      const [
        netflixMoviesRes, netflixSeriesRes,
        hboMoviesRes, hboSeriesRes,
        disneyMoviesRes, disneySeriesRes,
        primeMoviesRes, primeSeriesRes,
        appleMoviesRes, appleSeriesRes
      ] = await Promise.all([
        api.getTopShowsNoRandom('netflix', 'movie'),
        api.getTopShowsNoRandom('netflix', 'series'),
        api.getTopShowsNoRandom('hbo', 'movie'),
        api.getTopShowsNoRandom('hbo', 'series'),
        api.getTopShowsNoRandom('disney', 'movie'),
        api.getTopShowsNoRandom('disney', 'series'),
        api.getTopShowsNoRandom('prime', 'movie'),
        api.getTopShowsNoRandom('prime', 'series'),
        api.getTopShowsNoRandom('apple', 'movie'),
        api.getTopShowsNoRandom('apple', 'series')
      ]);
      setNetflixMovies(netflixMoviesRes.movies || []);
      setNetflixSeries(netflixSeriesRes.movies || []);
      setHboMovies(hboMoviesRes.movies || []);
      setHboSeries(hboSeriesRes.movies || []);
      setDisneyMovies(disneyMoviesRes.movies || []);
      setDisneySeries(disneySeriesRes.movies || []);
      setPrimeMovies(primeMoviesRes.movies || []);
      setPrimeSeries(primeSeriesRes.movies || []);
      setAppleMovies(appleMoviesRes.movies || []);
      setAppleSeries(appleSeriesRes.movies || []);
      setLoading(false);
    }
    fetchAll();
  }, []);

  return (
    <div style={{ marginTop: '100px' }}>
      <div className="movies-row-fullwidth">
        {netflixMovies.length > 0 && (
          <>
            <h2>Películas de Netflix</h2>
            <MoviesRow movies={netflixMovies} loading={loading} />
          </>
        )}
        {netflixSeries.length > 0 && (
          <>
            <h2>Series de Netflix</h2>
            <MoviesRow movies={netflixSeries} loading={loading} />
          </>
        )}
      </div>
      <div className="movies-row-fullwidth">
        {hboMovies.length > 0 && (
          <>
            <h2>Películas de HBO</h2>
            <MoviesRow movies={hboMovies} loading={loading} />
          </>
        )}
        {hboSeries.length > 0 && (
          <>
            <h2>Series de HBO</h2>
            <MoviesRow movies={hboSeries} loading={loading} />
          </>
        )}
      </div>
      <div className="movies-row-fullwidth">
        {disneyMovies.length > 0 && (
          <>
            <h2>Películas de Disney+</h2>
            <MoviesRow movies={disneyMovies} loading={loading} />
          </>
        )}
        {disneySeries.length > 0 && (
          <>
            <h2>Series de Disney+</h2>
            <MoviesRow movies={disneySeries} loading={loading} />
          </>
        )}
      </div>
      <div className="movies-row-fullwidth">
        {primeMovies.length > 0 && (
          <>
            <h2>Películas de Prime Video</h2>
            <MoviesRow movies={primeMovies} loading={loading} />
          </>
        )}
        {primeSeries.length > 0 && (
          <>
            <h2>Series de Prime Video</h2>
            <MoviesRow movies={primeSeries} loading={loading} />
          </>
        )}
      </div>
      <div className="movies-row-fullwidth">
        {appleMovies.length > 0 && (
          <>
            <h2>Películas de Apple TV+</h2>
            <MoviesRow movies={appleMovies} loading={loading} />
          </>
        )}
        {appleSeries.length > 0 && (
          <>
            <h2>Series de Apple TV+</h2>
            <MoviesRow movies={appleSeries} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationsPage;
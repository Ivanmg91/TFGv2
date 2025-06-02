import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarTrailerYouTube } from '../ytApi';
import { obtenerImagenActorWikipedia } from '../wikiApi';
import * as api from '../api.js';
import MoviesRow from '../components/MoviesRow.js';
import './PagesCss/InfoShowPage.css';
import SeeNowList from '../components/SeeNowList/SeeNowList.js';
import DonationButton from '../components/DonationButton/DonationButton.js';

function InfoShowPage() {
    const location = useLocation();
    const selectedMovie = location.state?.movie;
    const [trailerId, setTrailerId] = useState(null);

    // Estados para las películas relacionadas
    const [movies, setMovies] = useState([]);
    // const [setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);

    const [castImages, setCastImages] = useState({});

    const [platformMovies, setPlatformMovies] = useState([]);
    const [platformLoading, setPlatformLoading] = useState(true);

    

    useEffect(() => {
      async function fetchCastImages() {
        if (!selectedMovie?.cast) return;
        const images = {};
        await Promise.all(
          selectedMovie.cast.slice(0, 8).map(async (actor) => { // Limita a 8 para rendimiento
            if (!actor) return;
            const img = await obtenerImagenActorWikipedia(actor);
            images[actor] = img;
          })
        );
        setCastImages(images);
      }
      fetchCastImages();
    }, [selectedMovie]);

    useEffect(() => {
        const genreTranslationsReverse = {
            "Acción": "action",
            "Aventura": "adventure",
            "Animación": "animation",
            "Comedia": "comedy",
            "Crimen": "crime",
            "Documental": "documentary",
            "Drama": "drama",
            "Familiar": "family",
            "Fantasía": "fantasy",
            "Historia": "history",
            "Terror": "horror",
            "Música": "music",
            "Misterio": "mystery",
            "Romance": "romance",
            "Ciencia ficción": "scifi",
            "Película de TV": "tv_movie",
            "Suspenso": "thriller",
            "Guerra": "war",
            "Occidental": "western"
        };

        if (selectedMovie && selectedMovie.genres && selectedMovie.genres.length > 0) {
            setLoading(true);
            // Traduce todos los géneros al código que espera la API
            const genresInEnglish = selectedMovie.genres
                .map(g => genreTranslationsReverse[g] || g)
                .filter(Boolean);

            api.getShowsByFilters(
                null,
                genresInEnglish, // Usa todos los géneros
                [],
                [],
                0,
                50,
                1900,
                new Date().getFullYear(),
                null,
                null,
                "or"
            ).then(result => {
                // Filtra para no mostrar la película principal
                let filtered = result.movies.filter(m => m.title !== selectedMovie.title);
                filtered = filtered.sort(() => Math.random() - 0.5);
                setMovies(filtered);
                setHasMore(result.hasMore);
                setLoading(false);
            }).catch(() => setLoading(false));
        }
    }, [selectedMovie]);

    useEffect(() => {
        async function fetchPlatformMovies() {
            if (!selectedMovie?.streamingOptions) return;
            setPlatformLoading(true);
            // Obtén los IDs de las plataformas
            const platformIds = Object.values(selectedMovie.streamingOptions)
                .flat()
                .map(opt => opt.service?.id)
                .filter(Boolean);

            const uniquePlatforms = Array.from(new Set(platformIds));
            if (uniquePlatforms.length === 0) {
                setPlatformMovies([]);
                setPlatformLoading(false);
                return;
            }

            const result = await api.getShowsByFilters(
                null,
                [],
                uniquePlatforms, // Usa todas las plataformas
                [],
                0,
                50,
                1900,
                new Date().getFullYear(),
                null,
                null,
                "or"
            );
            let filtered = result.movies.filter(m => m.title !== selectedMovie.title);
            filtered = filtered.sort(() => Math.random() - 0.5);
            setPlatformMovies(filtered);
            setPlatformLoading(false);
        }
        fetchPlatformMovies();
    }, [selectedMovie]);

    useEffect(() => {
    if (selectedMovie) {
      buscarTrailerYouTube(selectedMovie.title, selectedMovie.releaseYear)
        .then(id => setTrailerId(id));
    }
  }, [selectedMovie]);

    if (!selectedMovie) {
        return <div>No hay información de la película seleccionada.</div>;
    }

    const languageNames = {
        spa: "Español",
        eng: "Inglés",
        fra: "Francés",
        ita: "Italiano",
        deu: "Alemán",
        por: "Portugués",
        cat: "Catalán",
        glg: "Gallego",
        eus: "Euskera",
        ron: "Rumano",
        hun: "Húngaro",
        ces: "Checo",
        slk: "Eslovaco",
        slv: "Esloveno",
        hrv: "Croata",
        srp: "Serbio",
        bos: "Bosnio",
        mkd: "Macedonio",
        alb: "Albanés",
        ell: "Griego",
        nld: "Neerlandés",
        swe: "Sueco",
        fin: "Finlandés",
        dan: "Danés",
        nor: "Noruego",
        isl: "Islandés",
        lit: "Lituano",
        lav: "Letón",
        est: "Estonio",
        pol: "Polaco",
        bul: "Búlgaro",
        rus: "Ruso",
        ukr: "Ucraniano",
        bel: "Bielorruso",
        kaz: "Kazajo",
        uzb: "Uzbeko",
        tur: "Turco",
        aze: "Azerí",
        kur: "Kurdo",
        fas: "Persa (Farsi)",
        pus: "Pastún",
        pan: "Panyabí",
        urd: "Urdu",
        hin: "Hindi",
        mar: "Maratí",
        ben: "Bengalí",
        guj: "Gujarati",
        ori: "Oriya",
        mal: "Malayalam",
        tel: "Telugu",
        tam: "Tamil",
        kan: "Canarés",
        nep: "Nepalí",
        sin: "Cingalés",
        tha: "Tailandés",
        khm: "Jemer (Camboyano)",
        lao: "Lao",
        mya: "Birmano",
        vie: "Vietnamita",
        ind: "Indonesio",
        msa: "Malayo",
        jpn: "Japonés",
        zho: "Chino",
        cmn: "Chino Mandarín",
        yue: "Cantonés",
        wuu: "Chino Wu (Shanghainés)",
        nan: "Min Nan (Taiwanés)",
        hak: "Hakka",
        kor: "Coreano",
        mon: "Mongol",
        ara: "Árabe",
        heb: "Hebreo",
        amh: "Amhárico",
        som: "Somalí",
        swa: "Suajili",
        afr: "Afrikáans",
        zul: "Zulú",
        xho: "Xhosa",
        hau: "Hausa",
        yor: "Yoruba",
        ibo: "Igbo",
        fil: "Filipino",
        ceb: "Cebuano",
        hmn: "Hmong",
        tlh: "Klingon", // Ficción
        qya: "Quenya", // Lenguas élficas
        sjn: "Sindarin",
        val: "Valyrio", // Game of Thrones
        doth: "Dothraki",
        wol: "Wolof",
        nob: "Noruego Bokmål"
    };

    return (
        <>  
            {selectedMovie.horizontalBackDrop && (
                <div className="backdrop-container">
                    <img
                        src={selectedMovie.horizontalBackDrop}
                        alt="Backdrop"
                        className="backdrop-image"
                    />
                    {/* Título sobre el backdrop */}
                    <div className="backdrop-title">
                        <h1>{selectedMovie.title}</h1>
                    </div>
                    <div className="backdrop-originaltitle">
                        <h1>Titulo original: {selectedMovie.originalTitle} ({selectedMovie.releaseYear ? selectedMovie.releaseYear : ''})</h1>
                    </div>
                    <div className="backdrop-rating">
                        <h1>{selectedMovie.rating / 10} / 10</h1>
                    </div>
                    <div className="backdrop-overlay"></div>
                </div>
            )}

            <div className="info-show-container">
            <div className="info-left">
                <h1>VER AHORA</h1>
                <SeeNowList streamingOptions={selectedMovie.streamingOptions} selectedMovie={selectedMovie} languageNames={languageNames} />

                <div className="spacer"></div>
        
                <h1>SINOPSIS</h1>
                <p className="info-description">{selectedMovie?.overview}</p>

                <div className="spacer"></div>

                <h1>TRAILER</h1>
                <div className="trailer-container">
                {trailerId ? (
                    <iframe
                    src={`https://www.youtube.com/embed/${trailerId}`}
                    title="Tráiler"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                ) : (
                    <span>Tráiler no disponible</span>
                )}
                </div>

                <div className="spacer"></div>

                <h1>ACTORES</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                {selectedMovie.cast && selectedMovie.cast.length > 0 ? (
                    selectedMovie.cast.slice(0, 8).map(actor => (
                        <a
                            key={actor}
                            href={`https://es.wikipedia.org/wiki/${encodeURIComponent(actor.replace(/ /g, '_'))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                                            <div key={actor} style={{ width: 100, textAlign: 'center' }}>
                            <img
                            src={castImages[actor] || 'https://via.placeholder.com/100x140?text=No+Foto'}
                            alt={actor}
                            style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 8, background: '#222' }}
                            />
                            <div style={{ marginTop: 8, fontSize: 14, color: '#fff' }}>{actor}</div>
                        </div>
                        </a>
                    ))
                ) : (
                    <span style={{ color: '#bfc9d4' }}>No disponible</span>
                )}
                </div>

                <div className="spacer"></div>
                
                <h1>COMENTARIOS</h1>
            </div>








            
            <div className="info-right">
                <div className="info-right-row">
                    <div className="info-details">
                        <p className='info-original-title'><strong>INFORMACIÓN DE LA PELICULA</strong></p>
                        <p><strong>Calificación:</strong> {selectedMovie.rating / 10 || 'No disponible'}</p>
                        <p><strong>Fecha de estreno:</strong> {selectedMovie.releaseYear ? selectedMovie.releaseYear : 'No disponible'}</p>                    </div>
                    <img className="info-poster" src={selectedMovie.poster} alt={selectedMovie.title} />
                </div>
                <div className='custom-btn-row'>
                    <button className="custom-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                        2k
                    </button>
                    <button className="custom-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>                        2k
                </button>
                </div>

                <div className='custom-btn-row'>
                    <button className="custom-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                        Favorito
                    </button>
                    <button className="custom-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                        Visto
                </button>
                </div>
                <div className='info-separation-line'></div>
                <h1>DIRECTOR</h1>
                <p>
                    {Array.isArray(selectedMovie.directors) && selectedMovie.directors.length > 0
                        ? selectedMovie.directors.join(', ')
                        : 'No disponible'}
                </p>

                <div className='info-separation-line'></div>
                <h1>GÉNEROS</h1>
                <p>{Array.isArray(selectedMovie.genres) ? selectedMovie.genres.join(', ') : selectedMovie.genres}</p>

                <div className='info-separation-line'></div>
                <h1>DURACIÓN</h1>
                <p>{selectedMovie.runtime}</p>

                <div className='info-separation-line'></div>
                <h1>IDIOMAS</h1>
                <p>
                {selectedMovie.languages && selectedMovie.languages.audios.length > 0
                    ? selectedMovie.languages.audios
                        .map(code => languageNames[code] || code)
                        .join(', ')
                    : 'No disponible'}
                </p>

                <div className='info-separation-line'></div>
                <h1>PLATAFORMAS</h1>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', }}>
                    {selectedMovie.streamingOptions && Object.values(selectedMovie.streamingOptions).length > 0 ? (
                        (() => {
                            // Filtrar plataformas únicas por id
                            const uniquePlatforms = [];
                            const seenIds = new Set();
                            Object.values(selectedMovie.streamingOptions).flat().forEach(option => {
                                if (
                                    option.service &&
                                    option.service.id &&
                                    !seenIds.has(option.service.id)
                                ) {
                                    seenIds.add(option.service.id);
                                    uniquePlatforms.push(option);
                                }
                            });
                            return uniquePlatforms.map((option, idx) => (
                                option.service.imageSet && option.service.imageSet.lightThemeImage ? (
                                    <div
                                        key={option.service.id + '-' + (option.type || '') + '-' + (option.link || idx)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <a
                                            href={option.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <img
                                                src={option.service.imageSet.lightThemeImage}
                                                alt={option.service.name}
                                                style={{ width: 60, height: 60, objectFit: 'contain', marginBottom: 4 }}
                                            />
                                        </a>
                                    </div>
                                ) : null
                            ));
                        })()
                    ) : (
                        <span style={{ color: '#bfc9d4' }}>No disponible</span>
                    )}
                </div>
                <div className='info-separation-line'></div>
                <h1>DONAR</h1>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20 }}>
                    <DonationButton amount="1" label="Donar" />
                </div>
                
            </div>
        </div>
        <div className="movies-row-fullwidth">
        <h1>MISMOS GÉNEROS</h1>
            <MoviesRow movies={movies} hasMore={hasMore} loading={loading} />
        </div>

        <div className="movies-row-fullwidth">
        <h1>DE LA MISMA PLATAFORMA</h1>
            <MoviesRow movies={platformMovies} hasMore={false} loading={platformLoading} />
        </div>

        <div className="movies-row-fullwidth">
            <h1>MISMOS GÉNEROS (cambiar)</h1>
            <MoviesRow movies={movies} hasMore={hasMore} loading={loading} />
        </div>

        </>
        
    );
}

export default InfoShowPage;
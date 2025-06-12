import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { buscarTrailerYouTube } from '../ytApi.js';
import { obtenerImagenActorWikipedia } from '../wikiApi.js';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import * as api from '../api.js';
import MoviesRow from '../components/MoviesRow.js';
import './PagesCss/InfoShowPage.css';
import SeeNowList from '../components/SeeNowList/SeeNowList.js';
import DonationButton from '../components/DonationButton/DonationButton.js';
import CommentsRow from '../components/CommentsRow/CommentsRow.js';

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

    const [yearMovies, setYearMovies] = useState([]);
    const [yearLoading, setYearLoading] = useState(true);

    const [isWatched, setIsWatched] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userId, setUserId] = useState(null);

    const [comentarios, setComentarios] = useState([]);

    const [showCommentForm, setShowCommentForm] = useState(false);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [comentarioError, setComentarioError] = useState("");

    const [likeStatus, setLikeStatus] = useState(null); // 'like', 'dislike' o null
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const navigate = useNavigate();

    const requireLogin = () => {
        setShowLoginPopup(true);
    };


    const handleEnviarComentario = async () => {
    if (!userId || !selectedMovie?.id || !nuevoComentario.trim()) {
        setComentarioError("El comentario no puede estar vacío.");
        return;
    }
    try {
        const res = await fetch(`${backendUrl}/api/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            usuario_id: userId,
            show_id: selectedMovie.id,
            comentario: nuevoComentario.trim(),
        }),
        });
        if (res.ok) {
        setNuevoComentario("");
        setShowCommentForm(false);
        setComentarioError("");
        // Recargar comentarios
        const resComentarios = await fetch(`${backendUrl}/api/comentarios/${selectedMovie.id}`);
        if (resComentarios.ok) {
            const data = await resComentarios.json();
            setComentarios(data);
        }
        } else {
        setComentarioError("Error al enviar el comentario.");
        }
    } catch (err) {
        setComentarioError("Error al enviar el comentario.");
    }
    };

    function getBackendUrl() {
        const hostname = window.location.hostname;
        if (hostname.includes("localhost")) {
            return "http://localhost:4000";
        }
        if (hostname.includes("netlify.app")) {
            return "https://tfgv2.onrender.com";
        }
        if (hostname.includes("app.github.dev")) {
            return "https://tfgv2.onrender.com";
        }
        // Por defecto, producción
        return "https://tfgv2.onrender.com";
    }
    const backendUrl = process.env.REACT_APP_BACKEND_URL || getBackendUrl();

    useEffect(() => {
        async function fetchComentarios() {
            if (!selectedMovie?.id) return;
            try {
            const res = await fetch(`${backendUrl}/api/comentarios/${selectedMovie.id}`);
            if (res.ok) {
                const data = await res.json();
                setComentarios(data);
            }
            } catch (err) {
            setComentarios([]);
            }
        }
        fetchComentarios();
    }, [selectedMovie, backendUrl]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser && selectedMovie) {
            try {
                const res = await fetch(`${backendUrl}/api/usuarios/${currentUser.uid}`);
                if (res.ok) {
                const data = await res.json();
                setUserId(data.id);
                // Comprobar si es favorito
                const favRes = await fetch(`${backendUrl}/api/favoritos/${data.id}/${selectedMovie.id}`);
                const favData = await favRes.json();
                setIsFavorite(favData.favorito);

                // Comprobar si es visto
                const vistoRes = await fetch(`${backendUrl}/api/vistos/${data.id}/${selectedMovie.id}`);
                const vistoData = await vistoRes.json();
                setIsWatched(vistoData.visto);

                const likesRes = await fetch(`${backendUrl}/api/likes/${data.id}/${selectedMovie.id}`);
                const likesData = await likesRes.json();
                setLikeStatus(likesData.user); // like dislike nul
                setLikeCount(likesData.likes);
                setDislikeCount(likesData.dislikes);

                }
            } catch (err) {
                setUserId(null);
                setIsFavorite(false);
                setIsWatched(false);
            }
            } else {
            setUserId(null);
            setIsFavorite(false);
            setIsWatched(false);
            }
        });
        return () => unsubscribe();
    }, [selectedMovie, backendUrl]);

    const handleLike = async () => {
        if (!userId || !selectedMovie) {
            requireLogin();
            return;
        }
        if (!userId || !selectedMovie) return;
        if (likeStatus === 'like') {
            // Quitar like
            const res = await fetch(`${backendUrl}/api/likes`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id }),
            });
            if (res.ok) {
            setLikeStatus(null);
            setLikeCount(likeCount - 1);
            }
        } else {
            // Poner like (y quitar dislike si lo hay)
            const res = await fetch(`${backendUrl}/api/likes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id, tipo: 'like' }),
            });
            if (res.ok) {
            setLikeStatus('like');
            setLikeCount(likeStatus === 'dislike' ? likeCount + 1 : likeCount + 1);
            setDislikeCount(likeStatus === 'dislike' ? dislikeCount - 1 : dislikeCount);
            }
        }
        };

        const handleDislike = async () => {
            if (!userId || !selectedMovie) {
                requireLogin();
                return;
            }
            if (!userId || !selectedMovie) return;
            if (likeStatus === 'dislike') {
                // Quitar dislike
                const res = await fetch(`${backendUrl}/api/likes`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id }),
                });
                if (res.ok) {
                setLikeStatus(null);
                setDislikeCount(dislikeCount - 1);
                }
            } else {
                // Poner dislike (y quitar like si lo hay)
                const res = await fetch(`${backendUrl}/api/likes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id, tipo: 'dislike' }),
                });
                if (res.ok) {
                setLikeStatus('dislike');
                setDislikeCount(likeStatus === 'like' ? dislikeCount + 1 : dislikeCount + 1);
                setLikeCount(likeStatus === 'like' ? likeCount - 1 : likeCount);
                }
            }
        };

    const handleToggleFavorite = async () => {
        if (!userId || !selectedMovie) {
            requireLogin();
            return;
        }
        console.log("userId:", userId, "selectedMovie.id:", selectedMovie?.id);

        if (!userId || !selectedMovie) return;
        if (isFavorite) {
            // Quitar de favoritos
            const res = await fetch(`${backendUrl}/api/favoritos`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id }),
            });
            if (res.ok) setIsFavorite(false);
        } else {
            // Añadir a favoritos
            const res = await fetch(`${backendUrl}/api/favoritos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: userId,
                show_id: selectedMovie.id,
                titulo: selectedMovie.title,
                descripcion: selectedMovie.overview,
                anio: selectedMovie.releaseYear,
            }),
            });
            if (res.ok) setIsFavorite(true);
        }
    };

    const handleToggleWatched = async () => {
        if (!userId || !selectedMovie) {
            requireLogin();
            return;
        }
        if (!userId || !selectedMovie) return;
        if (isWatched) {
            // Quitar de vistos
            const res = await fetch(`${backendUrl}/api/vistos`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_id: userId, show_id: selectedMovie.id }),
            });
            if (res.ok) setIsWatched(false);
        } else {
            // Añadir a vistos
            const res = await fetch(`${backendUrl}/api/vistos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: userId,
                show_id: selectedMovie.id,
                titulo: selectedMovie.title || "",
                descripcion: selectedMovie.overview || "",
                anio: selectedMovie.releaseYear || null,
            }),
            });
            if (res.ok) setIsWatched(true);
        }
    };




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

    async function fetchMoviesByGenres() {
        if (selectedMovie && selectedMovie.genres && selectedMovie.genres.length > 0) {
            setLoading(true);
            const genresInEnglish = selectedMovie.genres
                .map(g => genreTranslationsReverse[g] || g)
                .filter(Boolean);

            try {
                const result = await api.getShowsByFilters(
                    null,
                    genresInEnglish, // Todos los géneros juntos
                    [],
                    [],
                    0,
                    100,
                    1900,
                    new Date().getFullYear(),
                    null,
                    null,
                    "and" // <-- Cambia a "and"
                );
                // Elimina duplicados y la película principal
                const uniqueMovies = Array.from(
                    new Map(
                        result.movies
                            .filter(m => m.title !== selectedMovie.title)
                            .map(m => [m.title, m])
                    ).values()
                );
                setMovies(uniqueMovies.sort(() => Math.random() - 0.5));
            } catch (error) {
                console.error(`Error buscando películas para los géneros:`, error);
                setMovies([]);
            }
            setHasMore(false);
            setLoading(false);
        }
    }
        fetchMoviesByGenres();
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

        let allMovies = [];
        for (const platformId of uniquePlatforms) {
            try {
                const result = await api.getShowsByFilters(
                    null,
                    [],
                    [platformId], // Solo una plataforma por petición
                    [],
                    0,
                    100,
                    1900,
                    new Date().getFullYear(),
                    null,
                    null,
                    "or"
                );
                allMovies = allMovies.concat(result.movies);
            } catch (error) {
                console.error(`Error buscando películas para la plataforma ${platformId}:`, error);
            }
        }
        // Elimina duplicados y la película principal
        const uniqueMovies = Array.from(
            new Map(
                allMovies
                    .filter(m => m.title !== selectedMovie.title)
                    .map(m => [m.title, m])
            ).values()
        );
        setPlatformMovies(uniqueMovies.sort(() => Math.random() - 0.5));
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

  useEffect(() => {
    async function fetchYearMovies() {
        if (!selectedMovie?.releaseYear) {
            setYearMovies([]);
            setYearLoading(false);
            return;
        }
        setYearLoading(true);
        try {
            const result = await api.getShowsByFilters(
                null,
                [],
                [],
                [],
                0,
                100,
                selectedMovie.releaseYear,
                selectedMovie.releaseYear,
                null,
                null,
                "or"
            );
            // Elimina la película principal y duplicados
            const uniqueMovies = Array.from(
                new Map(
                    result.movies
                        .filter(m => m.title !== selectedMovie.title)
                        .map(m => [m.title, m])
                ).values()
            );
            setYearMovies(uniqueMovies.sort(() => Math.random() - 0.5));
        } catch (error) {
            console.error("Error buscando películas del mismo año:", error);
            setYearMovies([]);
        }
        setYearLoading(false);
    }
    fetchYearMovies();
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
        < >  
            {selectedMovie.horizontalBackDrop && (
                <div className="backdrop-container" >
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

                <div style={{ display: "flex", alignItems: "center", gap: 8, }}>
                    <h1 style={{ margin: 0 }}>COMENTARIOS</h1>
                        {userId && (
                            <button
                            style={{
                                background: "#222",
                                color: "#fff",
                                border: "none",
                                borderRadius: "50%",
                                width: 32,
                                height: 32,
                                fontSize: 22,
                                cursor: "pointer",
                                lineHeight: "32px",
                                padding: 0,
                                marginLeft: 8
                            }}
                            title="Añadir comentario"
                            onClick={() => setShowCommentForm((v) => !v)}
                            >+</button>
                        )}
                </div>
            </div>








            
            <div className="info-right">
                <div className="info-right-row">
                    <div className="info-details">
                        <p className='info-original-title'><strong>INFORMACIÓN DE LA {selectedMovie.showType === "series" ? "SERIE" : "PELICULA"}</strong></p>
                        <p><strong>Calificación:</strong> {selectedMovie.rating / 10 || 'No disponible'}</p>
                        <p><strong>Fecha de estreno:</strong> {selectedMovie.releaseYear ? selectedMovie.releaseYear : 'No disponible'}</p>                    </div>
                    <img className="info-poster" src={selectedMovie.poster} alt={selectedMovie.title} />
                </div>
                <div className='custom-btn-row'>
                    <button className="custom-btn" style={{ color: likeStatus === 'like' ? '#4cafef' : 'white' }} onClick={handleLike}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M720-120H280v-520l280-280 50 50q7 7 11.5 19t4.5 23v14l-44 174h258q32 0 56 24t24 56v80q0 7-2 15t-4 15L794-168q-9 20-30 34t-44 14Zm-360-80h360l120-280v-80H480l54-220-174 174v406Zm0-406v406-406Zm-80-34v80H160v360h120v80H80v-520h200Z"/></svg>
                        {likeCount}
                    </button>
                    <button className="custom-btn" style={{ color: likeStatus === 'dislike' ? '#e74c3c' : 'white' }} onClick={handleDislike}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-840h440v520L400-40l-50-50q-7-7-11.5-19t-4.5-23v-14l44-174H120q-32 0-56-24t-24-56v-80q0-7 2-15t4-15l120-282q9-20 30-34t44-14Zm360 80H240L120-480v80h360l-54 220 174-174v-406Zm0 406v-406 406Zm80 34v-80h120v-360H680v-80h200v520H680Z"/></svg>
                        {dislikeCount}
                </button>
                </div>

                <div className='custom-btn-row'>
                    <button className="custom-btn" style={{ color: isFavorite ? 'red' : 'white' }} onClick={handleToggleFavorite}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/></svg>
                        Favorito
                    </button>
                    <button className="custom-btn" style={{ color: isWatched ? 'blue' : 'white' }} onClick={handleToggleWatched}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    
                </div>
                    {showCommentForm && (
                    <div style={{ margin: "12px 0" }}>
                        <textarea
                        value={nuevoComentario}
                        onChange={e => setNuevoComentario(e.target.value)}
                        rows={3}
                        style={{ width: "100%", borderRadius: 6, padding: 8, resize: "vertical" }}
                        placeholder="Escribe tu comentario..."
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button onClick={handleEnviarComentario} style={{ background: "#4caf50", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px" }}>
                            Enviar
                        </button>
                        <button onClick={() => { setShowCommentForm(false); setComentarioError(""); }} style={{ background: "#888", color: "#fff", border: "none", borderRadius: 4, padding: "6px 16px" }}>
                            Cancelar
                        </button>
                        </div>
                        {comentarioError && <div style={{ color: "red", marginTop: 4 }}>{comentarioError}</div>}
                    </div>
                    )}
                    <div style={{ padding: "0 6rem" }}>
                        <CommentsRow comentarios={comentarios} />
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
        <h1>DEL MISMO AÑO</h1>
            <MoviesRow movies={yearMovies} hasMore={false} loading={yearLoading} />
        </div>

        {showLoginPopup && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.6)",
                    zIndex: 9999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div style={{
                        background: "#232a32",
                        color: "#fff",
                        borderRadius: 12,
                        padding: 32,
                        minWidth: 300,
                        boxShadow: "0 4px 24px #000a",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 16
                    }}>
                    <h2 style={{margin: 0}}>¡Necesitas iniciar sesión!</h2>
                    <p style={{margin: 0, textAlign: "center"}}>Debes estar logueado para usar esta función.</p>
                    <div style={{display: "flex", gap: 12, marginTop: 12}}>
                        <button
                            style={{padding: "8px 18px", borderRadius: 6, border: "none", background: "#4cafef", color: "#fff", fontWeight: "bold", cursor: "pointer"}}
                            onClick={() => { setShowLoginPopup(false); navigate("/login"); }}
                        >
                            Iniciar sesión
                        </button>
                        <button
                            style={{padding: "8px 18px", borderRadius: 6, border: "none", background: "#4caf50", color: "#fff", fontWeight: "bold", cursor: "pointer"}}
                            onClick={() => { setShowLoginPopup(false); navigate("/register"); }}
                        >
                            Registrarse
                        </button>
                    </div>
                    <button
                        style={{marginTop: 8, background: "none", color: "#fff", border: "none", cursor: "pointer", fontSize: 18}}
                        onClick={() => setShowLoginPopup(false)}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        )}

        </>
        
    );
}

export default InfoShowPage;
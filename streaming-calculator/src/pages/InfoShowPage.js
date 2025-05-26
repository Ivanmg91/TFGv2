import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { buscarTrailerYouTube } from '../ytApi';
import './PagesCss/InfoShowPage.css'; // Asegúrate de importar el CSS

function InfoShowPage() {
    const location = useLocation();
    const selectedMovie = location.state?.movie;
    const [trailerId, setTrailerId] = useState(null);

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
        doth: "Dothraki"
    };

    return (
        <div className="info-show-container">
            <div className="info-left">
                <h1>VER AHORA</h1>


                <h1>QUÉ MÁS PODRÍA INTERESARTE</h1>

                <h1>SINOPSIS</h1>
                <p className="info-description">{selectedMovie.overview || 'Descripción no disponible'}</p>

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

                <h1>CAST</h1>
                <h1>COMENTARIOS</h1>
            </div>








            
            <div className="info-right">
                <div className="info-right-row">
                    <div className="info-details">
                        <p className='info-original-title'><strong>{selectedMovie.originalTitle}</strong></p>
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
                                    <div key={option.service.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                
            </div>
        </div>
    );
}

export default InfoShowPage;
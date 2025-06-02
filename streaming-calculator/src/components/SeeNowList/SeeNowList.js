// import React from 'react';
// import './SeeNowList.css';
// import { obtenerAudiosDeOpcion, obtenerSubtitulosDeOpcion } from '../../api.js';

// const SHRINKME_USER_ID = 'TU_ID_DE_USUARIO'; // Reemplaza por tu ID real

// const getShrinkMeUrl = (originalUrl) =>
//   `https://shrinkme.io/st?api=${SHRINKME_USER_ID}&url=${encodeURIComponent(originalUrl)}`;


// const typeTranslations = {
//   subscription: 'Suscripción',
//   rent: 'Alquilar',
//   buy: 'Comprar',
//   free: 'Gratis',
//   addon: 'Suscripción',
// };
// const defaultPrices = {
//   'disney': 'Desde 5,99 EUR',
//   'zee5': 'Desde 9.98 EUR',
//   'plutotv': '',
//   'prime': 'Desde 4.99 EUR',
//   'curiosity': 'Desde 2.50 EUR',
//   'mubi': 'Desde 9.99 EUR',
//   'apple': 'Desde 9.99 EUR',
//   'netflix': 'Desde 6.99 EUR',
// };

// const SeeNowList = ({ streamingOptions, selectedMovie, languageNames }) => {
//   const options = Object.values(streamingOptions || {}).flat();

//   if (!options.length) {
//     return <p>No hay plataformas disponibles.</p>;
//   }

//   return (
//     <div className="streaming-options-list">
//       {options.map((option, idx) => {
//         const serviceId = option.service?.id?.toLowerCase() || option.service?.name?.toLowerCase();
//         const defaultPrice = defaultPrices[serviceId] || '';

//         // Obtener idiomas de audio y subtítulos para esta opción
//         const audios = obtenerAudiosDeOpcion(option);
//         const subs = obtenerSubtitulosDeOpcion(option);

//         return (
//           <div className="streaming-option-card" key={option.service?.id || idx}>
//             {/* Logo de la plataforma */}
//             <div className="streaming-option-logo">
//               <img
//                 src={option.service?.imageSet?.lightThemeImage}
//                 alt={option.service?.name || 'Logo'}
//                 width={60}
//                 height={60}
//                 style={{ objectFit: 'contain', borderRadius: 8 }}
//               />
//             </div>
//             <div className="streaming-option-info">
//               <div className="streaming-option-info-col">
//                 <div className="streaming-option-tags">
//                   <span className="tag">CC</span>
//                   <span className="tag">HD</span>
//                   {option.age && <span className="tag">{option.age}</span>}
//                 </div>
//                 <div className="streaming-option-details">
//                   <span>{selectedMovie.runtime}</span> {audios.length > 0 ? audios.map(code => languageNames[code] || code).join(', ') : 'No disponible'}
//                   <br />
//                   {/* <span style={{ fontSize: '13px', color: '#ffd600' }}>
//                     <strong>Subtítulos:</strong> {subs.length > 0 ? subs.map(code => languageNames[code] || code).join(', ') : 'No disponible'}
//                   </span> */}
//                 </div>
//               </div>
//               <div className="streaming-option-price-center">
//                 {typeTranslations[option.type] || option.type}
//                 <div>
//                   {
//                     option.price?.formatted ||
//                     option.displayPrice?.formatted ||
//                     (option.price?.amount && option.price?.currency
//                       ? `${option.price.amount} ${option.price.currency}`
//                       : defaultPrice)
//                   }
//                 </div>
//               </div>
//             </div>
//             <div className="streaming-option-action">
//               <a
//                 href={getShrinkMeUrl(option.link)}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="streaming-option-btn"
//               >
//                 ▶ Ver ahora
//               </a>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SeeNowList;

/* VERSIÓN CON ACORTADOR DE ANUNCIOS*/
import React, { useEffect, useState } from 'react';
import './SeeNowList.css';
import { obtenerAudiosDeOpcion, obtenerSubtitulosDeOpcion } from '../../api.js';
import InfoModal from '../InfoModal/InfoModal.js';

const SHRINKME_API_TOKEN = '46a8dfe712411de5f66206b0eec6aa27fe9fdd18';

const typeTranslations = {
  subscription: 'Suscripción',
  rent: 'Alquilar',
  buy: 'Comprar',
  free: 'Gratis',
};
const defaultPrices = {
  'disney': 'Desde 5,99 EUR',
  'zee5': 'Desde 9.98 EUR',
  'plutotv': '',
  'prime': 'Desde 4.99 EUR',
  'curiosity': 'Desde 2.50 EUR',
  'mubi': 'Desde 9.99 EUR',
  'apple': 'Desde 9.99 EUR',
  'netflix': 'Desde 6.99 EUR',
  'hbo': 'Desde 6.99 EUR',
};

const SeeNowList = ({ streamingOptions, selectedMovie, languageNames }) => {
  const options = Object.values(streamingOptions || {}).flat();
  const [shortLinks, setShortLinks] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetails, setModalDetails] = useState({});


  useEffect(() => {
    // Acorta todos los enlaces al cargar o cambiar las opciones
    const shortenAllLinks = async () => {
      const newShortLinks = {};
      await Promise.all(options.map(async (option, idx) => {
        const url = option.link;
        if (!url) return;
        try {
          const res = await fetch(
            `https://shrinkme.io/api?api=${SHRINKME_API_TOKEN}&url=${encodeURIComponent(url)}&format=text`
          );
          const shortUrl = await res.text();
          if (shortUrl && shortUrl.startsWith('http')) {
            newShortLinks[idx] = shortUrl;
          } else {
            newShortLinks[idx] = url; // fallback al original si falla
          }
        } catch {
          newShortLinks[idx] = url;
        }
      }));
      setShortLinks(newShortLinks);
    };
    shortenAllLinks();
  }, [streamingOptions, options]);

  if (!options.length) {
    return <p>No hay plataformas disponibles.</p>;
  }

  return (
  <div className="streaming-options-list">
    <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} details={modalDetails} />
    {options.map((option, idx) => {
      const serviceId = option.addon?.id?.toLowerCase() || option.service?.id?.toLowerCase() || option.service?.name?.toLowerCase();
      const uniqueKey = `${serviceId}-${option.type || ''}-${option.link || ''}-${idx}`;
      const defaultPrice = defaultPrices[serviceId] || '';
      const audios = obtenerAudiosDeOpcion(option);

      // Prepara los detalles para el modal
      const modalInfo = {
        title: selectedMovie.title,
        platform: option.addon?.name || option.service?.name || '',
        runtime: selectedMovie.runtime,
        quality: option.quality || 'HD',
        audio: audios.length > 0 ? audios.map(code => languageNames[code] || code).join(', ') : 'No disponible',
        subs: (obtenerSubtitulosDeOpcion(option).map(code => languageNames[code] || code).join(', ')) || 'No disponible',
        audioTech: option.audioTech || 'No disponible',
      };

      return (
        <div className="streaming-option-card" key={uniqueKey}>
          <div className="streaming-option-logo">
            <img
              src={option.addon?.imageSet?.lightThemeImage || option.service?.imageSet?.lightThemeImage}
              alt={option.service?.name || 'Logo'}
              width={60}
              height={60}
              style={{ objectFit: 'contain', borderRadius: 8 }}
            />
          </div>
          <div className="streaming-option-info">
            <div className="streaming-option-info-col">
              <div className="streaming-option-tags">
                <span className="tag" style={{cursor:'pointer'}} onClick={() => { setModalDetails(modalInfo); setModalOpen(true); }}>CC</span>
                <span className="tag" style={{cursor:'pointer'}} onClick={() => { setModalDetails(modalInfo); setModalOpen(true); }}>HD</span>
                {option.age && <span className="tag">{option.age}</span>}
              </div>
              <div
                className="streaming-option-details"
                style={{cursor:'pointer'}}
                onClick={() => { setModalDetails(modalInfo); setModalOpen(true); }}
              >
                <span>{selectedMovie.runtime}</span> {audios.length > 0 
                ? audios.slice(0, 2).map(code => languageNames[code] || code).join(', ') + (audios.length > 2 ? '...' : '') 
                : 'No disponible'}
                <br />
              </div>
            </div>
            <div className="streaming-option-price-center">
              {option.addon?.name || typeTranslations[option.type] || option.type}
              <div>
                {
                  option.price?.formatted ||
                  option.displayPrice?.formatted ||
                  (option.price?.amount && option.price?.currency
                    ? `${option.price.amount} ${option.price.currency}`
                    : defaultPrice)
                }
              </div>
            </div>
          </div>
          <div className="streaming-option-action">
            <a
              href={shortLinks[idx] || option.link}
              target="_blank"
              rel="noopener noreferrer"
              className="streaming-option-btn"
            >
              ▶ Ver ahora
            </a>
          </div>
        </div>
      );
    })}
  </div>
);
};

export default SeeNowList;
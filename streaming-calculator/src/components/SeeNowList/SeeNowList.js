import React from 'react';
import './SeeNowList.css';
import { obtenerAudiosDeOpcion, obtenerSubtitulosDeOpcion } from '../../api.js';

const typeTranslations = {
  subscription: 'Suscripción',
  rent: 'Alquilar',
  buy: 'Comprar',
  free: 'Gratis',
  addon: 'Suscripción',
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

  if (!options.length) {
    return <p>No hay plataformas disponibles.</p>;
  }

  return (
    <div className="streaming-options-list">
      {options.map((option, idx) => {
        const serviceId = option.service?.id?.toLowerCase() || option.service?.name?.toLowerCase();
        const defaultPrice = defaultPrices[serviceId] || '';

        // Obtener idiomas de audio y subtítulos para esta opción
        const audios = obtenerAudiosDeOpcion(option);
        const subs = obtenerSubtitulosDeOpcion(option);

        return (
          <div className="streaming-option-card" key={option.service?.id || idx}>
            {/* Logo de la plataforma */}
            <div className="streaming-option-logo">
              <img
                src={option.service?.imageSet?.lightThemeImage}
                alt={option.service?.name || 'Logo'}
                width={60}
                height={60}
                style={{ objectFit: 'contain', borderRadius: 8 }}
              />
            </div>
            <div className="streaming-option-info">
              <div className="streaming-option-info-col">
                <div className="streaming-option-tags">
                  <span className="tag">CC</span>
                  <span className="tag">HD</span>
                  {option.age && <span className="tag">{option.age}</span>}
                </div>
                <div className="streaming-option-details">
                  <span>{selectedMovie.runtime}</span> {audios.length > 0 ? audios.map(code => languageNames[code] || code).join(', ') : 'No disponible'}
                  <br />
                  {/* <span style={{ fontSize: '13px', color: '#ffd600' }}>
                    <strong>Subtítulos:</strong> {subs.length > 0 ? subs.map(code => languageNames[code] || code).join(', ') : 'No disponible'}
                  </span> */}
                </div>
              </div>
              <div className="streaming-option-price-center">
                {typeTranslations[option.type] || option.type}
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
                href={option.link}
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
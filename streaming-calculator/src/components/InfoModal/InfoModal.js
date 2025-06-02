import React from 'react';
import './InfoModal.css';

const InfoModal = ({ open, onClose, details }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Detalles de streaming para {details.title} en {details.platform}</h2>
        <table>
          <tbody>
            <tr>
              <td>Duración</td>
              <td>{details.runtime}</td>
            </tr>
            <tr>
              <td>Calidad</td>
              <td>{details.quality.toUpperCase()}</td>
            </tr>
            <tr>
              <td>Idioma del audio</td>
              <td>{details.audio}</td>
            </tr>
            <tr>
              <td>Idioma de los subtítulos</td>
              <td>{details.subs}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfoModal;
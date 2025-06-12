import React from 'react';
import './PagesCss/HomePage.css';

function HomePage() {
  return (
    <div className="homepage-container">
      <img
        src="/originallogo.png"
        alt="Logo"
        className="homepage-logo"
      />
      <div className="homepage-description">
        <h1>Bienvenido a Streamly</h1>
        <p>
          Este proyecto te ayuda a descubrir, comparar y gestionar tus películas y series favoritas en todas las plataformas de streaming. 
          Busca títulos, consulta dónde verlos, guarda tus favoritos, deja comentarios y recibe recomendaciones personalizadas.
        </p>
        <p className="highlight">
          ¡Explora el mundo del streaming de forma sencilla y centralizada!
        </p>
      </div>
    </div>
  );
}

export default HomePage;
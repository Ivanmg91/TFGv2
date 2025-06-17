// import React, { useEffect, useState } from 'react';
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar.js';
import HomePage from './pages/HomePage.js';
import ChoosePlatformPage from './pages/ChoosePlatformPage.js';
import RecommendationsPage from './pages/RecommendationsPage.js';
import DiscoverPage from './pages/DiscoverPage.js';
import SearchPage from './pages/SearchPage.js';
import InfoShowPage from './pages/InfoShowPage.js';
import WhoWeArePage from './pages/WhoWeArePage.js';
import RegisterPage from './pages/RegisterPage.js';
import LoginPage from './pages/LoginPage.js';
import FavoritosPage from './pages/FavoritosPage.js';


function App() {
  // useEffect(() => {
  //   const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  //   document.body.classList.toggle('dark', darkMode);
  //   document.body.classList.toggle('light', !darkMode);
  // }, []);
  const [searchText, setSearchText] = useState("");

  // Para acceder a location en rutas hijas, crea un wrapper
  function FavoritosPageWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    return (
      <FavoritosPage
        userId={userId}
        onBack={() => navigate(-1)}
      />
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar setSearchText={setSearchText} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/see" element={<DiscoverPage />} />
            <Route path="/chooseplatform" element={<ChoosePlatformPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/info" element={<InfoShowPage />} />
            <Route path="/search" element={<SearchPage searchText={searchText} />} />
            <Route path="/whoweare" element={<WhoWeArePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/favoritos" element={<FavoritosPageWrapper />} />
            {/* ...otras rutas... */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
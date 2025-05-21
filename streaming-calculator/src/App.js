import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar.js';
import HomePage from './pages/HomePage.js';
import NewPage from './pages/NewPage.js';
import PopularPage from './pages/PopularPage.js';
import DiscoverPage from './pages/DiscoverPage.js';
import SearchPage from './pages/SearchPage.js';

function App() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar setSearchText={setSearchText} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/see" element={<DiscoverPage />} />
            <Route path="/new" element={<NewPage />} />
            <Route path="/popular" element={<PopularPage />} />
            <Route path="/search" element={<SearchPage searchText={searchText} />} />
            {/* ...otras rutas... */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
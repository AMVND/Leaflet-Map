// src/components/Sidebar.js
import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ onPlaceSelected, onToggleSidebar, isOpen }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const toggleSidebar = () => {
    onToggleSidebar();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name or address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul className="search-results">
        {results.map((result) => (
          <li key={result.place_id} onClick={() => onPlaceSelected(result)}>
            {result.display_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

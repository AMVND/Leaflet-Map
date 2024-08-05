import React, { useState } from 'react';
import './Sidebar.css';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      <div className="sidebar-content">
        <h2>Sidebar</h2>
        <p>This is a responsive sidebar.</p>
      </div>
    </div>
  );
};

export default SideBar;

import React from 'react';
// import Map from './components/Map';
import MapWithRouting from './components/MapWithRouting';
import Sidebar from './components/sidebar/SideBar';
import './App.css';
import './customDraw.css'

function App() {



  useEffect(() => {
    const mapControls = document.querySelectorAll('.leaflet-control');
    mapControls.forEach((control) => {
      control.style.marginLeft = isSidebarOpen ? 'var(--sidebar-toggle-width)' : 'var(--map-control-margin)';
    });
  }, [isSidebarOpen]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handlePlaceSelected = (place) => {
    setSelectedPlace({
      lat: place.lat,
      lon: place.lon,
      display_name: place.display_name,
    });
  };

  return (
    <div className="App">
      <div className="main-content">
        <button
          className={`open-button ${!isSidebarOpen ? 'visible' : ''}`}
          onClick={handleSidebarToggle}
        >
          =
        </button>

        <Sidebar onPlaceSelected={handlePlaceSelected} onToggleSidebar={handleSidebarToggle} isOpen={isSidebarOpen} />
        {/* <Map /> */}
        <MapWithRouting />
      </div>
    </div>
  );
}

export default App;

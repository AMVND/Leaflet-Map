import React from 'react';
import Map from './components/Map';
import './App.css';
// import SideBar from './components/sidebar/SideBar';

function App() {
  return (
    <div className="App">
      {/* <SideBar/> */}
      <div className="main-content">
        <Map />
      </div>
    </div>
  );
}

export default App;

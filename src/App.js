/* import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
 */
import React, { useState } from 'react';
import Modal from './components/Modal';
import MapPicker from './components/MapPicker';
import { searchFuelStations } from './services/api';

const App = () => {
  const [stations, setStations] = useState([]);
  const [radius, setRadius] = useState(5);
  const [modalStation, setModalStation] = useState(null);
  const [mapMode, setMapMode] = useState(false);

  const fetchStationsByLocation = async (lat, lng) => {
    try {
      const data = await searchFuelStations({ lat, lng, radius });
      setStations(data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  return (
    <div className="App">
      <h1>Fuel Station Finder</h1>
      
      {mapMode ? (
        <div>
          <button onClick={() => setMapMode(false)}>Switch to Search</button>
          <MapPicker onLocationSelect={(lat, lng) => fetchStationsByLocation(lat, lng)} />
        </div>
      ) : (
        <div>
          <input 
            type="number" 
            value={radius} 
            onChange={(e) => setRadius(e.target.value)} 
            placeholder="Enter radius (km)" 
          />
          <button onClick={() => setMapMode(true)}>Select on Map</button>
        </div>
      )}

      <div>
        {stations.map(station => (
          <div key={station.id} onClick={() => setModalStation(station)}>
            <h2>{station.name}</h2>
            <p>{station.place}</p>
          </div>
        ))}
      </div>

      {modalStation && (
        <Modal onClose={() => setModalStation(null)}>
          <h2>{modalStation.name}</h2>
          <p>{modalStation.street}, {modalStation.place}</p>
          <p>Diesel: {modalStation.diesel}€</p>
          <p>E5: {modalStation.e5}€</p>
          <p>E10: {modalStation.e10}€</p>
        </Modal>
      )}
    </div>
  );
};

export default App;
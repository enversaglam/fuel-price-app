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
import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { getStationsNearby } from "./services/api";

const App = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState(5);
  const [stations, setStations] = useState([]);

  const fetchStations = async () => {
    try {
      const data = await getStationsNearby(latitude, longitude, radius);
      if (data.ok) {
        setStations(data.stations);
      } else {
        alert("Error fetching stations: " + data.message);
      }
    } catch (error) {
      alert("An error occurred while fetching data.");
    }
  };

  return (
    <div>
      <h1>Tankstellen-Preise Suchen</h1>
      <div>
        <label>Latitude:</label>
        <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
      </div>
      <div>
        <label>Radius (km):</label>
        <input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} />
      </div>
      <button onClick={fetchStations}>Ara</button>

      <h2>Sonuçlar</h2>
      <ul>
        {stations.map((station) => (
          <li key={station.id}>
            {station.name} - {station.brand} - Diesel: {station.diesel || "N/A"}€ - E5: {station.e5 || "N/A"}€
          </li>
        ))}
      </ul>
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </div>
    
  );
};


export default App;
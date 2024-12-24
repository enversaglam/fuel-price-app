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
import { searchByPostcodeOrPlace } from './services/api';

const App = () => {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(5);
  const [fuelType, setFuelType] = useState('e5'); // 'e5', 'e10', 'diesel', 'all'
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      setError(null); // Hata mesajını sıfırla
      const apiKey = 'a14a2e07-973a-729f-dd9a-06e0a63493ca'; // Tankerkönig API anahtarınızı buraya ekleyin
      const data = await searchByPostcodeOrPlace({
        query,
        radius,
        fuelType,
        apiKey,
      });
      setStations(data.stations || []);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Yakıt Fiyatları Arama</h1>
      <div>
        <label>
          Posta Kodu veya Yer Adı:
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Örn: Berlin veya 10115"
          />
        </label>
        <label>
          Arama Yarıçapı (km):
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            min="1"
            max="25"
          />
        </label>
        <label>
          Yakıt Türü:
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)}>
            <option value="e5">Super E5</option>
            <option value="e10">Super E10</option>
            <option value="diesel">Diesel</option>
            <option value="all">Hepsi</option>
          </select>
        </label>
        <button onClick={handleSearch}>Ara</button>
      </div>

      {error && <p style={{ color: 'red' }}>Hata: {error}</p>}

      <h2>Sonuçlar:</h2>
      <ul>
        {stations.map((station) => (
          <li key={station.id}>
            {station.name} - {station.place} ({station.dist} km) - 
            {fuelType === 'all' ? (
              <>
                E5: {station.e5 || 'N/A'}, E10: {station.e10 || 'N/A'}, Diesel: {station.diesel || 'N/A'}
              </>
            ) : (
              <>{station[fuelType] || 'N/A'} EUR</>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
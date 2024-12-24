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
import { searchByCity, fetchStationDetails } from './services/api';

const App = () => {
  const [cityQuery, setCityQuery] = useState('');
  const [radius, setRadius] = useState(5); // Varsayılan radius
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = 'a14a2e07-973a-729f-dd9a-06e0a63493ca';

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setStations([]);
    setSelectedStation(null);

    try {
      const results = await searchByCity({ cityQuery, radius, apiKey: API_KEY });
      setStations(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStationClick = async (stationId) => {
    setLoading(true);
    setError('');

    try {
      const details = await fetchStationDetails(stationId, API_KEY);
      setSelectedStation(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedStation(null);
  };

  return (
    <div className="App">
      <h1>Yakıt İstasyonu Arama</h1>

      <div>
        <input
          type="text"
          placeholder="Şehir adı girin"
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Yarıçap (km)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          min="1"
          max="25"
        />
        <button onClick={handleSearch} disabled={loading}>
          Ara
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h2>Yakıt İstasyonları</h2>
        <ul>
          {stations.map((station) => (
            <li key={station.id}>
              {station.name} ({station.brand}) - {station.dist} km
              <button onClick={() => handleStationClick(station.id)}>
                Detaylar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selectedStation && (
        <div className="modal" style={modalStyles.overlay}>
          <div style={modalStyles.content}>
            <h2>{selectedStation.name} Detayları</h2>
            <p>Adres: {selectedStation.street}, {selectedStation.place}</p>
            <p>Benzin (E5): {selectedStation.e5 || 'Bilgi yok'}</p>
            <p>Benzin (E10): {selectedStation.e10 || 'Bilgi yok'}</p>
            <p>Dizel: {selectedStation.diesel || 'Bilgi yok'}</p>
            <p>Açık mı? {selectedStation.isOpen ? 'Evet' : 'Hayır'}</p>
            <button onClick={closeModal}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '100%',
  },
};

export default App;
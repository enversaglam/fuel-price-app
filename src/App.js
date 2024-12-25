import React, { useState } from 'react';
import { searchByCity, fetchStationDetails } from './services/api';
import './App.css';

const statesWithCities = {
  "Baden-Württemberg": ["Stuttgart", "Karlsruhe", "Freiburg", "Mannheim"],
  "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Regensburg"],
  "Berlin": ["Berlin"],
  "Brandenburg": ["Potsdam", "Cottbus", "Brandenburg an der Havel"],
  "Hesse": ["Frankfurt", "Wiesbaden", "Darmstadt", "Kassel"],
  "Nordrhein Westfallen": ["Düsseldorf", "Köln", "Monheim am Rhein", "Langenfeld"],
  // Add other states and cities here
};

const App = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [radius, setRadius] = useState(5);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!selectedCity) {
      setError('Lütfen bir şehir seçin.');
      return;
    }

    setLoading(true);
    setError('');
    setStations([]);
    setSelectedStation(null);

    try {
      const results = await searchByCity({ cityQuery: selectedCity, radius, apiKey: 'a14a2e07-973a-729f-dd9a-06e0a63493ca' });
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
      const details = await fetchStationDetails(stationId, 'a14a2e07-973a-729f-dd9a-06e0a63493ca');
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
        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity('');
          }}
        >
          <option value="">Eyalet Seçin</option>
          {Object.keys(statesWithCities).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">Şehir Seçin</option>
          {selectedState && statesWithCities[selectedState].map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Yarıçap (km)"
          value={radius}
          onChange={(e) => setRadius(e.target.value)}
          min="1"
          max="25"
        />
        <button onClick={handleSearch} disabled={loading || !selectedCity}>
          Ara
        </button>
      </div>

      {loading && <p>Yükleniyor...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <ul>
          {stations.map((station) => (
            <li key={station.id}>
              <strong>{station.name}</strong> ({station.brand}) - {station.dist} km
              <button onClick={() => handleStationClick(station.id)}>Detaylar</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedStation && (
        <div className="modal">
          <div>
            <h2>{selectedStation.name} Detayları</h2>
            <p>Adres: {selectedStation.street}, {selectedStation.place}</p>
            <p>Benzin (E5): {selectedStation.e5 || 'Bilgi yok'}</p>
            <p>Benzin (E10): {selectedStation.e10 || 'Bilgi yok'}</p>
            <p>Dizel: {selectedStation.diesel || 'Bilgi yok'}</p>
            <p>Açık mı? {selectedStation.isOpen ? 'Evet' : 'Hayır'}</p>
            <button onClick={closeModal}>Kapat</button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${selectedStation.lat},${selectedStation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '10px', textDecoration: 'none', color: 'white', background: '#007bff', padding: '10px', borderRadius: '4px' }}
            >
              Haritada Aç
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
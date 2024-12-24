import React, { useState } from "react";
import { searchByCity } from "./services/api";

const CitySearch = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = [
    { name: "Berlin", query: "Berlin, Germany" },
    { name: "Munich", query: "Munich, Germany" },
    { name: "Hamburg", query: "Hamburg, Germany" },
    { name: "Cologne", query: "Cologne, Germany" },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await searchByCity({
        cityQuery: selectedCity,
        radius: 10, // Varsayılan olarak 10 km radius
        fuelType: "all", // Tüm yakıt türlerini getir
        apiKey: "a14a2e07-973a-729f-dd9a-06e0a63493ca",
      });
      setStations(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Şehir Bazlı Yakıt İstasyonu Arama</h2>
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">Bir şehir seçin</option>
        {cities.map((city) => (
          <option key={city.name} value={city.query}>
            {city.name}
          </option>
        ))}
      </select>
      <button onClick={handleSearch} disabled={!selectedCity}>
        Ara
      </button>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {stations.length > 0 && (
        <ul>
          {stations.map((station) => (
            <li key={station.id}>
              {station.name} - {station.e5 ? `E5: €${station.e5}` : "E5 yok"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;
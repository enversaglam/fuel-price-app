// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://creativecommons.tankerkoenig.de/json';
const API_KEY = "a14a2e07-973a-729f-dd9a-06e0a63493ca"; // Demo Key

// Search by city
export const searchByCity = async ({ cityQuery, radius = 10, fuelType = 'all', apiKey }) => {
  try {
    // Use the geocode API to convert the city query into coordinates
    const geocodeResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: cityQuery,
        format: 'json',
        limit: 1,
      },
    });

    if (!geocodeResponse.data.length) {
      throw new Error('Şehir bulunamadı. Lütfen farklı bir arama deneyin.');
    }

    const { lat, lon } = geocodeResponse.data[0];

    // Fetch gas stations near the coordinates
    const stationsResponse = await axios.get(`${API_BASE_URL}/list.php`, {
      params: {
        lat,
        lng: lon,
        rad: radius,
        type: fuelType,
        apikey: apiKey,
      },
    });

    if (stationsResponse.data.ok) {
      return stationsResponse.data.stations;
    } else {
      throw new Error(stationsResponse.data.message || 'Yakıt istasyonları getirilemedi.');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Bir hata oluştu.');
  }
};

// Fetch station details by ID
export const fetchStationDetails = async (stationId, apiKey) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/detail.php`, {
      params: {
        id: stationId,
        apikey: apiKey,
      },
    });

    if (response.data.ok) {
      return response.data.station;
    } else {
      throw new Error(response.data.message || 'Detay bilgisi getirilemedi.');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || 'Bir hata oluştu.');
  }
};
import axios from 'axios';

const API_BASE_URL = "https://creativecommons.tankerkoenig.de/json";
const API_KEY = "a14a2e07-973a-729f-dd9a-06e0a63493ca"; // Demo Key

export const getStationsNearby = async (lat, lng, rad, type = 'all') => {
  const url = `${API_BASE_URL}/list.php`;
  try {
    const response = await axios.get(url, {
      params: {
        lat,
        lng,
        rad,
        type,
        sort: "dist",
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby stations:", error);
    throw error;
  }
};

export const getStationDetails = async (id) => {
  const url = `${API_BASE_URL}/detail.php`;
  try {
    const response = await axios.get(url, {
      params: { id, apikey: API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching station details:", error);
    throw error;
  }
};
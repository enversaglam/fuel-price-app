import axios from 'axios';

const tankerKoenigApi = axios.create({
  baseURL: 'https://creativecommons.tankerkoenig.de/json',
});

const openCageApi = axios.create({
  baseURL: 'https://api.opencagedata.com/geocode/v1/json', // OpenCage Geocoder API
});

/**
 * Posta kodu veya yer adıyla arama yapan fonksiyon
 * @param {Object} params - Arama parametreleri
 * @param {string} params.query - Posta kodu veya yer adı
 * @param {number} params.radius - Arama yarıçapı (km)
 * @param {string} params.fuelType - Yakıt türü ('e5', 'e10', 'diesel', 'all')
 * @param {string} params.apiKey - Tankerkönig API anahtarı
 * @returns {Promise<Object>} Yakındaki istasyonların listesi
 */
export const searchByPostcodeOrPlace = async ({ query, radius, fuelType, apiKey }) => {
  try {
    console.log(`Geocoder API ile "${query}" için koordinatlar alınıyor...`);

    const geoResponse = await openCageApi.get('', {
      params: {
        q: query, // query: place veya postcode
        key: 'a14a2e07-973a-729f-dd9a-06e0a63493ca',
        language: 'en',
        countrycode: 'de', // Almanya ile sınırlandırma
      },
    });

    if (!geoResponse.data.results.length) {
      throw new Error(`"${query}" için koordinat bulunamadı. Daha fazla bağlam eklemeyi deneyin.`);
    }

    const { lat, lng } = geoResponse.data.results[0].geometry;

    console.log(`Koordinatlar alındı: lat=${lat}, lng=${lng}`);
    console.log('Yakındaki istasyonlar aranıyor...');

    const fuelResponse = await tankerKoenigApi.get('/list.php', {
      params: {
        lat,
        lng,
        rad: radius,
        type: fuelType,
        apikey: apiKey,
      },
    });

    if (!fuelResponse.data.stations.length) {
      throw new Error('Bu bölgede yakıt istasyonu bulunamadı.');
    }

    console.log('İstasyonlar başarıyla alındı:', fuelResponse.data.stations);
    return fuelResponse.data.stations;
  } catch (error) {
    console.error('Hata oluştu:', error.response?.data || error.message);
    throw error;
  }
};

export const searchByCity = async ({ cityQuery, radius, fuelType, apiKey }) => {
  try {
    console.log(`Geocoder API ile "${cityQuery}" için koordinatlar alınıyor...`);

    const geoResponse = await openCageApi.get('', {
      params: {
        q: cityQuery, // Şehir sorgusu
        key: 'a14a2e07-973a-729f-dd9a-06e0a63493ca',
        language: 'en',
        countrycode: 'de', // Almanya odaklı arama
      },
    });

    if (!geoResponse.data.results.length) {
      throw new Error(`"${cityQuery}" için koordinat bulunamadı. Lütfen doğru bir şehir adı girin.`);
    }

    const { lat, lng } = geoResponse.data.results[0].geometry;

    console.log(`Koordinatlar alındı: lat=${lat}, lng=${lng}`);
    console.log('Yakındaki istasyonlar aranıyor...');

    const fuelResponse = await tankerKoenigApi.get('/list.php', {
      params: {
        lat,
        lng,
        rad: radius,
        type: fuelType,
        apikey: apiKey,
      },
    });

    if (!fuelResponse.data.stations.length) {
      throw new Error('Bu şehirde yakıt istasyonu bulunamadı.');
    }

    console.log('İstasyonlar başarıyla alındı:', fuelResponse.data.stations);
    return fuelResponse.data.stations;
  } catch (error) {
    console.error('Hata oluştu:', error.response?.data || error.message);
    throw error;
  }
};
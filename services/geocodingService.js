// Функция для получения координат города через OpenStreetMap Nominatim (бесплатно)
async function getCityCoordinates(cityName, country = '') {
  try {
    const searchQuery = country ? `${cityName}, ${country}` : cityName;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YourApp/1.0 (your-email@example.com)'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка геокодинга:', error);
    return null;
  }
}

module.exports = {
  getCityCoordinates
};
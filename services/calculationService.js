const { getCityCoordinates } = require('./geocodingService');
const { calculateGreatCircleDistance } = require('../utils/distanceUtils');
const { calculateCost } = require('../utils/costCalculator');

// Функция для расчета расстояния между городами
async function calculateDistance(originCity, originCountry, destinationCity, destinationCountry = 'Russia') {
  try {
    // Получаем координаты городов
    const originCoords = await getCityCoordinates(originCity, originCountry);
    const destinationCoords = await getCityCoordinates(destinationCity, destinationCountry);
    
    if (!originCoords || !destinationCoords) {
      return {
        success: false,
        error: 'Не удалось определить координаты одного из городов'
      };
    }
    
    // Рассчитываем расстояние по прямой
    const distanceKm = calculateGreatCircleDistance(
      originCoords.lat, originCoords.lon,
      destinationCoords.lat, destinationCoords.lon
    );
    
    // Добавляем коэффициент для учета реального маршрута (примерно 1.3-1.5)
    const realisticDistanceKm = distanceKm * 1.4;
    
    return {
      success: true,
      distance: Math.round(realisticDistanceKm * 1000), // в метрах
      distanceText: `${Math.round(realisticDistanceKm)} км`,
      coordinates: {
        origin: originCoords,
        destination: destinationCoords
      }
    };
  } catch (error) {
    console.error('Ошибка расчета расстояния:', error);
    return {
      success: false,
      error: 'Ошибка при расчете расстояния'
    };
  }
}

// Функция для предварительного расчета стоимости
async function estimateCost(purchaseCountry, purchaseCity, deliveryCity, area, weight) {
  try {
    const distanceResult = await calculateDistance(purchaseCity, purchaseCountry, deliveryCity);
    
    const distanceKm = distanceResult.success ? distanceResult.distance / 1000 : 8000;
    const areaValue = parseFloat(area) || 0;
    const weightValue = parseFloat(weight) || 0;
    
    const estimatedCost = calculateCost(distanceKm, areaValue, weightValue);
    
    if (!distanceResult.success) {
      return {
        success: true,
        estimatedCost: estimatedCost,
        distance: `8000 км (приблизительно)`,
        currency: 'RUB',
        estimated: true
      };
    }
    
    return {
      success: true,
      estimatedCost: estimatedCost,
      distance: distanceResult.distanceText,
      currency: 'RUB'
    };
  } catch (error) {
    console.error('Ошибка при расчете стоимости:', error);
    
    
    const areaValue = parseFloat(area) || 0;
    const weightValue = parseFloat(weight) || 0;
    const fallbackCost = calculateCost(8000, areaValue, weightValue);
    
    return {
      success: true,
      estimatedCost: fallbackCost,
      distance: '8000 км (расчет по умолчанию)',
      currency: 'RUB',
      estimated: true
    };
  }
}

module.exports = {
  calculateDistance,
  estimateCost
};
const calculationService = require('../services/calculationService');

const calculateDistance = async (req, res) => {
  const { originCity, originCountry, destinationCity } = req.body;
  
  if (!originCity || !originCountry || !destinationCity) {
    return res.status(400).json({
      success: false,
      error: 'Необходимо указать город отправления, страну отправления и город доставки'
    });
  }
  
  try {
    const distanceResult = await calculationService.calculateDistance(originCity, originCountry, destinationCity);
    
    if (distanceResult.success) {
      res.json({
        success: true,
        distance: distanceResult.distance,
        distanceText: distanceResult.distanceText,
        coordinates: distanceResult.coordinates
      });
    } else {
      res.status(400).json({
        success: false,
        error: distanceResult.error
      });
    }
  } catch (error) {
    console.error('Ошибка при расчете расстояния:', error);
    res.status(500).json({
      success: false,
      error: 'Внутренняя ошибка сервера при расчете расстояния'
    });
  }
};

const estimateCost = async (req, res) => {
  const { purchaseCountry, purchaseCity, deliveryCity, area, weight } = req.body;
  
  
  
  try {
    const result = await calculationService.estimateCost(purchaseCountry, purchaseCity, deliveryCity, area, weight);
    res.json(result);
  } catch (error) {
    console.error('Ошибка при расчете стоимости:', error);
    res.status(500).json({
      success: false,
      error: 'Ошибка при расчете стоимости'
    });
  }
};

module.exports = {
  calculateDistance,
  estimateCost
};
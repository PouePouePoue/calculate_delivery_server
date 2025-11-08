const pool = require('../config/database');
const { calculateDistance, estimateCost } = require('./calculationService');

const createRequest = async (requestData) => {
  const {
    name,
    email,
    phone,
    purchaseCountry,
    purchaseCity,
    deliveryCity,
    area,
    weight,
    user_id
  } = requestData;

  console.log('Данные заявки:', { name, email, phone, purchaseCountry, purchaseCity, deliveryCity, area, weight, user_id });

  // Рассчитываем расстояние перед сохранением заявки
  const distanceResult = await calculateDistance(purchaseCity, purchaseCountry, deliveryCity);
  
  // Рассчитываем стоимость
  const distanceKm = distanceResult.success ? distanceResult.distance / 1000 : 8000;
  const areaValue = parseFloat(area) || 0;
  const weightValue = parseFloat(weight) || 0;
  
  console.log('Параметры для расчета:', { distanceKm, areaValue, weightValue });
  
  const { calculateCost } = require('../utils/costCalculator');
  const cost = calculateCost(distanceKm, areaValue, weightValue);
  
  if (!distanceResult.success) {
    console.warn('Не удалось рассчитать расстояние, используются значения по умолчанию');
    
    // Вставка с значениями по умолчанию
    const result = await pool.query(
      `INSERT INTO requests (
        creator_id, 
        status_id, 
        name, 
        email, 
        phone_number, 
        country_Buying, 
        city_Buying, 
        city_delivery, 
        area, 
        weight,
        distance_km,
        cost
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        user_id, 
        1, // defaultStatusId
        name, 
        email, 
        phone, 
        purchaseCountry, 
        purchaseCity, 
        deliveryCity, 
        areaValue, 
        weightValue,
        8000, // defaultDistance
        cost
      ]
    );
    
    // Сохраняем стоимость в таблицу cost
    await pool.query(
      `INSERT INTO cost (request_id, amount, currency) VALUES ($1, $2, $3)`,
      [result.rows[0].id, cost, 'RUB']
    );
    
    return {
      ...result.rows[0],
      distanceText: `8000 км (приблизительно)`,
      cost: cost
    };
  }

  const finalDistanceKm = Math.round(distanceResult.distance / 1000);
  
  // Вставка новой заявки с рассчитанным расстоянием и стоимостью
  const result = await pool.query(
    `INSERT INTO requests (
      creator_id, 
      status_id, 
      name, 
      email, 
      phone_number, 
      country_Buying, 
      city_Buying, 
      city_delivery, 
      area, 
      weight,
      distance,
      cost
    ) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [
      user_id, 
      1, // defaultStatusId
      name, 
      email, 
      phone, 
      purchaseCountry, 
      purchaseCity, 
      deliveryCity, 
      areaValue, 
      weightValue,
      finalDistanceKm,
      cost
    ]
  );
  
  
  
  return {
    ...result.rows[0],
    distanceText: distanceResult.distanceText,
    cost: cost
  };
};

module.exports = {
  createRequest
};
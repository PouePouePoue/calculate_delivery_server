// Функция расчета стоимости (в 10 раз дешевле)
function calculateCost(distanceKm, area, weight) {
  console.log('Параметры для расчета стоимости:', { distanceKm, area, weight });
  
  // Более реалистичные коэффициенты (в 10 раз дешевле)
  const baseRate = 500; // базовая ставка
  const distanceRate = distanceKm * 1.5; // ставка за км
  const areaRate = area * 30; // ставка за кв.м
  const weightRate = weight * 10; // ставка за кг
  
  console.log('Компоненты стоимости:', { baseRate, distanceRate, areaRate, weightRate });
  
  const estimatedCost = baseRate + distanceRate + areaRate + weightRate;
  const finalCost = Math.round(Math.max(estimatedCost, 1000)); // Минимальная стоимость 1000 руб
  
  console.log('Итоговая стоимость:', finalCost);
  return finalCost;
}

module.exports = {
  calculateCost
};
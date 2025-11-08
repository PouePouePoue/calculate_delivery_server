const validateRequest = (req, res, next) => {
  const { name, email, phone, purchaseCountry, purchaseCity, deliveryCity } = req.body;
  
  if (!name || !email || !phone || !purchaseCountry || !purchaseCity || !deliveryCity) {
    return res.status(400).json({
      message: 'Все обязательные поля должны быть заполнены'
    });
  }
  
  next();
};

module.exports = {
  validateRequest
};
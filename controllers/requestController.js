const requestService = require('../services/requestService');

const createRequest = async (req, res) => {
  try {
    const result = await requestService.createRequest(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Ошибка сохранения заявки:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest
};
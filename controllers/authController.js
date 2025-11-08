const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login
};
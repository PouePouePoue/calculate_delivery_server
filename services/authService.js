const pool = require('../config/database');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');

const register = async (userData) => {
  const { fullName, email, password } = userData;
  const can_access_admin = false; 
  const is_active = true;
  
  const userCheck = await pool.query(
    'SELECT * FROM users WHERE email = $1', 
    [email]
  );
  
  if (userCheck.rows.length > 0) {
    throw new Error('Пользователь с таким email уже существует');
  }

  const hashedPassword = await hashPassword(password);

  const result = await pool.query(
    'INSERT INTO users (full_name, email, password, can_access_admin, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [fullName, email, hashedPassword, can_access_admin, is_active]
  );
  
  return result.rows[0];
};

const login = async (userData) => {
  const { email, password } = userData;

  const userResult = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new Error('Пользователь с таким email не найден');
  }

  const user = userResult.rows[0];

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Неверный пароль');
  }

  return { 
    message: 'Вход выполнен успешно',
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      isAdmin: user.can_access_admin
    }
  };
};

module.exports = {
  register,
  login
};
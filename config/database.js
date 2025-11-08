const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Проверка подключения к базе данных
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.log('Ошибка подключения к базе данных: ', err);
  } else {
    console.log('База данных подключена: ', result.rows[0]);
  }
});

module.exports = pool;
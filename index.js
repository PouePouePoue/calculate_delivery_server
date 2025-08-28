const express = require('express');
const  {Pool} = require ('pg');
const app = express();
const cors = require('cors');
app.use(cors());


const pool = new Pool ({
  user:'postgres',
  host:'localhost',
  database: 'mydb',
  password: '1111',
  port: 5432,
});

pool.query('SELECT NOW()', (err, result) => {
  if (err){
    console.log('Ошибка выполнения запроса: ', err)
  } else{
    console.log('Результат запроса: ', result.rows[0])
  }
});


app.use(express.json());

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build API', completed: false },
];

app.get('/todos', (req, res) => res.json(todos));
app.post('/todos', (req, res) => {
  const newTodo = { id: todos.length + 1, task: req.body.task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;
  const can_access_admin = false; 
  const is_active = true ;
  try {
    // Проверка существования пользователя
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1', 
      [email]
    );
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Вставка нового пользователя
    const result = await pool.query(
            'INSERT INTO users (full_name, email, password, can_access_admin, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [fullName, email, password, can_access_admin, is_active]
        );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

// Добавляем endpoint для сохранения заявок
app.post('/api/requests', async (req, res) => {
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
  } = req.body;

  try {
    // Устанавливаем статус "новая" по умолчанию (предположим, что status_id = 1 для новой заявки)
    const defaultStatusId = 1;
    
    // Вставка новой заявки с правильными названиями полей
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
        weight
      ) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        user_id, 
        defaultStatusId, 
        name, 
        email, 
        phone, 
        purchaseCountry, 
        purchaseCity, 
        deliveryCity, 
        area, 
        weight
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка сохранения заявки:', error);
    res.status(500).json({ message: 'Ошибка сервера при сохранении заявки' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Поиск пользователя по email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Пользователь с таким email не найден' });
    }

    const user = userResult.rows[0];

    // Проверка пароля 
    if (user.password !== password) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    // Успешная аутентификация
    res.status(200).json({ 
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        isAdmin: user.can_access_admin
      }
    });

  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

app.listen(3001, () => console.log('Server is running on port 3001'));
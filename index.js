const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение всех маршрутов через единый файл
app.use(require('./routes'));

app.listen(process.env.PORT, () => console.info(`Server is running on port ${process.env.PORT}`));
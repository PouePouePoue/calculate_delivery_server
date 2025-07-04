const express = require('express');
const  {Pool} = require ('pg');

const app = express();

const pool = new Pool ({
  user:'postgres',
  host:'localhost',
  database: 'mydb',
  password: '1111',
  port: 5432,
});

pool.query('SELECT NOW()' , (err, result) => {
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

app.listen(3001, () => console.log('Server is running on port 3001'));
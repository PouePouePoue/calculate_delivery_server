const express = require('express');
const app = express();
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
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');

const app = express();


app.use(cors());
app.use(express.json());

// Routes
app.use(require('./routes/auth'));
app.use(require('./routes/requests'));
app.use(require('./routes/calculations'));




app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const newTodo = { id: todos.length + 1, task: req.body.task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
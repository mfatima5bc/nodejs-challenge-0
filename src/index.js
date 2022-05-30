const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }
  request.user = user;
  return next();
}

function checksExistsTodo(request, response, next) {
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({error: "Todo dos'not exists"});
  }

  request.todo = todo;
  return next();
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body;

  const userExistis = users.some(user => user.username === username);
  if (userExistis) {
    return response.status(400).json({ error: "Username already exists!" });
  }
  const user = {
    name,
    username,
    id: uuidv4(),
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { username } = request.params;
  const {user} = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo)
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  // Complete aqui
  const todo = request.todo;
  const { title, deadline } = request.body;

  todo.title = title;
  todo.deadline = deadline;
  // user.todos.reduce((ac, item) => {
  //   if (item.id === id) {
  //     item.title = title
  //     item.deadline = deadline
  //   }
  // })
  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checksExistsTodo, (request, response) => {
  // Complete aqui

  const todo = request.todo;

  todo.done = true;
  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksExistsTodo, (request, response) => {

  const { user } = request;

  const todo = request.todo;
  user.todos.splice(todo, 1);

  return response.status(204).json(todo);
});

module.exports = app;
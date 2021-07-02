const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// MIDDLEWARE TO CHECK IF USER EXISTS
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "Username not found!" });
  }

  request.user = user;
  return next();
}

//ROUTE - CREATE USER
app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (users.find((user) => user.username === username)) {
    return response.status(400).json({ error: "Username already registered!" });
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(201).json(user);
});

//ROUTE - LIST ALL USERS
app.get("/users", (request, response) => {
  return response.json(users);
});

//ROUTE - LIST ALL TO-DOs FROM A USER
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

//ROUTE - CREATE NEW TO-DO FOR A USER
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);
  return response.status(201).json(todo);
});

//ROUTE - UPDATE SEVERAL INFORMATION FROM A SPECIFIC TO-DO
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  let todo = user.todos.find((el) => el.id === id);

  if (!todo) {
    return response.status(404).json({ error: "To-do not found!" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

//ROUTE - UPDATE "STATUS" FROM A SPECIFIC TO-DO
app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

//ROUTE - DELETE A SPECIFIC TO-DO
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

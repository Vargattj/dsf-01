const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likes = 0;

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const checkedId = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (checkedId < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: repositories[checkedId].likes,
  };
  repositories[checkedId] = repository;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const checkedId = repositories.findIndex(
    (repository) => repository.id === id
  );
  if (checkedId >= 0) {
    repositories.splice(checkedId, 1);
  } else {
    return response.status(400).json({ error: "Repository not found" });
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const checkedId = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (checkedId < 0) {
    return response.status(400).json({ error: "Repository not found" });
  }
  repositories[checkedId] = { ...repositories[checkedId], likes: (likes += 1) };
  return response.status(200).json(repositories[checkedId]);
});

module.exports = app;
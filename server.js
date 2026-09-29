const express = require("express");
const app = express();

app.use(express.json());

// Stockage temporaire : ces données disparaissent quand le serveur s'arrête
let tasks = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({ message: "API en ligne" });
});

// LIRE toutes les tâches
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// LIRE une tâche
app.get("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });
  res.json(task);
});

// CRÉER une tâche
app.post("/tasks", (req, res) => {
  const { title } = req.body || {};
  if (!title)
    return res.status(400).json({ error: "Le titre est obligatoire" });

  const task = { id: nextId++, title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

// MODIFIER une tâche
app.put("/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id));
  if (!task) return res.status(404).json({ error: "Tâche introuvable" });

  const { title, done } = req.body || {};
  if (!title)
    return res.status(400).json({ error: "Le titre est obligatoire" });

  task.title = title;
  if (typeof done === "boolean") task.done = done;
  res.json(task);
});

// SUPPRIMER une tâche
app.delete("/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Tâche introuvable" });

  tasks.splice(index, 1);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Serveur lancé sur http://localhost:3000");
});

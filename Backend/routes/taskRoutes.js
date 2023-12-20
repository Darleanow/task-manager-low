const express = require("express");
const taskModel = require("../models/taskModels");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Création de tâche
router.post("/create_task", authenticateToken, async (req, res) => {
  const {
    projectId,
    taskName,
    description,
    statusId,
    complexity,
    dueDate,
    tags,
  } = req.body;

  try {
    const result = await taskModel.createTask(
      projectId,
      taskName,
      description,
      statusId,
      complexity,
      dueDate,
      tags
    );
    res.status(201).send("Task created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating a task");
  }
});

// Récupération des tâches par ID de projet
router.get("/:projectId", authenticateToken, async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const tasks = await taskModel.getTasksByProjectId(projectId);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tasks");
  }
});

// Mise à jour du statut d'une tâche
router.put("/update_task_status", authenticateToken, async (req, res) => {
  const { taskId, newStatusId } = req.body;

  try {
    const result = await taskModel.updateTaskStatus(taskId, newStatusId);
    res.status(200).send("Task status updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating task status");
  }
});

// Suppression d'une tâche
router.delete("/delete_task/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const result = await taskModel.deleteTask(taskId);
    res.status(200).send("Task deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting task");
  }
});

// Route to create a tag
router.post("/tags/create", async (req, res) => {
  try {
    const message = await taskModel.createTag(
      req.body.tagName,
      req.body.tagHexColor
    );
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to delete a tag
router.delete("/tags/delete/:id", async (req, res) => {
  try {
    const message = await taskModel.deleteTag(req.params.id);
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/tags/get_tags", authenticateToken, async (req, res) => {
  try {
    const tags = await taskModel.getTags(); // Récupère les tags
    res.status(200).json(tags); // Envoyez les tags en tant que réponse JSON
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching tags"); // Message d'erreur modifié
  }
});

// Route to create a status
router.post("/status/create", authenticateToken, async (req, res) => {
  const { status_name } = req.body;

  try {
    const message = await taskModel.createStatus(status_name);
    res.status(201).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Route to create a list
router.post("/lists/create", authenticateToken, async (req, res) => {
  const { listName, projectId, statusName } = req.body;

  try {
    const message = await taskModel.createList(listName, projectId, statusName);
    res.status(201).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Route to delete a list
router.delete("/lists/delete", authenticateToken, async (req, res) => {
  const { listName, projectId } = req.body;

  try {
    const message = await taskModel.deleteList(listName, projectId);
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.get("/lists/:projectId", authenticateToken, async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const lists = await taskModel.getListsByProjectId(projectId);
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching lists");
  }
});

router.put("/lists/update", authenticateToken, async (req, res) => {
  const { listId, newListName, newStatusId } = req.body;

  try {
    const message = await taskModel.updateList(listId, newListName, newStatusId);
    res.status(200).send(message);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});



module.exports = router;

const express = require("express");
const taskModel = require("../models/taskModels");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Création de tâche
router.post("/create_task", authenticateToken, async (req, res) => {
  const { projectId, taskName, description, statusId, complexity, dueDate } =
    req.body;

  try {
    const result = await taskModel.createTask(
      projectId,
      taskName,
      description,
      statusId,
      complexity,
      dueDate
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

module.exports = router;

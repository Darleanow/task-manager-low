const express = require("express");
const userModel = require("../models/userModels");
const projectModel = require("../models/projectModels");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Project creation endpoint
router.post("/add_project", authenticateToken, async (req, res) => {
  const { project_name, project_description, user_ids } = req.body;

  try {
    // Create the project
    const result = await projectModel.addProject(
      project_name,
      project_description,
      user_ids
    );

    // Prepare notification details
    const notificationText = `You have been added to the project: ${project_name}.`;
    const metadatas = "notificationType: ProjectCreation";

    // Send notifications to the users
    await userModel.sendNotifications(user_ids, notificationText, metadatas);

    res
      .status(201)
      .send("Project created successfully and notifications sent.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating a project");
  }
});

router.post("/set_favourite", authenticateToken, async (req, res) => {
  const { user_id, project_id, is_favourite } = req.body;

  try {
    const result = await projectModel.setFavourite(
      user_id,
      project_id,
      is_favourite
    );
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error trying to add project to favourites");
  }
});

router.get("/user_projects/:userId", authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userProjects = await projectModel.getUserProjects(userId);
    if (userProjects) {
      res.status(200).json(userProjects);
    } else {
      res.status(404).send("No data found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user projects");
  }
});

module.exports = router;

const express = require("express");
const projectModel = require("../models/projectModels");
const router = express.Router();

// Project creation endpoint
router.post("/add_project", async (req, res) => {
  const { project_name, project_description } = req.body;

  try {
    const result = await projectModel.addProject(
      project_name,
      project_description
    );
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating a project");
  }
});

router.post("/set_favourite", async(req, res) => {
    const { user_id, project_id, is_favourite } = req.body; // Ajout de user_id

    try {
        const result = await projectModel.setFavourite(
            user_id,
            project_id,
            is_favourite
        );
        res.status(201).send(result);
    } catch(err) {
        console.error(err);
        res.status(500).send("Error trying to add project to favourites");
    }
});


router.get("/user_projects", async (req, res) => {
  try {
    const userProjects = await projectModel.getUserProjects(req.user.user_id);
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

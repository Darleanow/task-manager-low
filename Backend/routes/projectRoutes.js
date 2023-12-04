const express = require("express");
const projectModel = require("../models/projectModel");
const router = express.Router();

// Project creation endpoint
router.post("/add_project", async (req, res) => {
    const { project_name, project_description } = req.body;

    try {
        const result = await projectModel.addProject(project_name, project_description);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'insertion dans la base de données");
    }
});

module.exports = router;

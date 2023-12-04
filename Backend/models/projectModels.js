const db = require("../config/dbConfig");

async function addProject(project_name, project_description) {
    const query = "INSERT INTO projects (project_name, project_description) VALUES (?, ?)";
    return new Promise((resolve, reject) => {
        db.query(query, [project_name, project_description], (err, result) => {
            if (err) reject(err);
            resolve("Données ajoutées avec succès");
        });
    });
}

module.exports = {
    addProject
};

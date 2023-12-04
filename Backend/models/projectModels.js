const db = require("../config/dbConfig");

async function addProject(project_name, project_description) {
  const query =
    "INSERT INTO projects (project_name, project_description) VALUES (?, ?)";
  return new Promise((resolve, reject) => {
    db.query(query, [project_name, project_description], (err, result) => {
      if (err) reject(err);
      resolve("Données ajoutées avec succès");
    });
  });
}

async function getUserProjects(userID) {
  const query = `
        SELECT 
            p.project_id, 
            p.project_name, 
            p.project_description, 
            CASE 
                WHEN f.project_id IS NOT NULL THEN 'Favori' 
                ELSE 'Normal' 
            END AS status 
        FROM 
            Projects p 
        JOIN 
            UserProjects up ON p.project_id = up.project_id 
        LEFT JOIN 
            Favorites f ON p.project_id = f.project_id AND f.user_id = up.user_id 
        WHERE 
            up.user_id = ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(query, [userID], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results);
      } else {
        resolve(null);
      }
    });
  });
}

async function setFavourite(user_id, project_id, is_favourite) {
  if (is_favourite) {
      // Add to favorites
      const insertQuery = `
          INSERT INTO Favorites (user_id, project_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE user_id = user_id;`;

      return new Promise((resolve, reject) => {
          db.query(insertQuery, [user_id, project_id], (err, result) => {
              if (err) reject(err);
              resolve("Projet ajouté aux favoris");
          });
      });
  } else {
      // Remove from favorites
      const deleteQuery = `
          DELETE FROM Favorites
          WHERE user_id = ? AND project_id = ?;`;

      return new Promise((resolve, reject) => {
          db.query(deleteQuery, [user_id, project_id], (err, result) => {
              if (err) reject(err);
              resolve("Projet retiré des favoris");
          });
      });
  }
}


module.exports = {
  addProject,
  getUserProjects,
  setFavourite
};

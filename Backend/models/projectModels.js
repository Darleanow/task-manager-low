const db = require("../config/dbConfig");

async function getUserProjects(userID) {
  const projectsQuery = `
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
    db.query(projectsQuery, [userID], async (err, projects) => {
      if (err) {
        reject(err);
        return;
      }

      if (projects.length === 0) {
        resolve([]);
        return;
      }

      // For each project, fetch its tasks
      const projectsWithTasks = await Promise.all(projects.map(async (project) => {
        const tasksQuery = `
          SELECT * FROM Tasks WHERE project_id = ?;
        `;
        const tasks = await new Promise((resolve, reject) => {
          db.query(tasksQuery, [project.project_id], (err, tasks) => {
            if (err) {
              reject(err);
            } else {
              resolve(tasks);
            }
          });
        });

        return { ...project, tasks };
      }));

      resolve(projectsWithTasks);
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

async function addProject(projectName, projectDescription, userIds) {
  return new Promise((resolve, reject) => {
    // Begin transaction
    db.beginTransaction((err) => {
      if (err) reject(err);

      // Query to insert into Projects table
      const insertProjectQuery = `
              INSERT INTO Projects (project_name, project_description) 
              VALUES (?, ?);
          `;

      db.query(
        insertProjectQuery,
        [projectName, projectDescription],
        (err, projectResult) => {
          if (err) {
            return db.rollback(() => {
              reject(err);
            });
          }

          const projectId = projectResult.insertId;

          // Prepare promises for each userId insert
          const userProjectPromises = userIds.map((userId) => {
            return new Promise((resolve, reject) => {
              const insertUserProjectQuery = `
                          INSERT INTO UserProjects (user_id, project_id) 
                          VALUES (?, ?);
                      `;
              db.query(
                insertUserProjectQuery,
                [userId, projectId],
                (err, result) => {
                  if (err) {
                    reject(err); // Rejects individual promise
                  } else {
                    resolve(result); // Resolves individual promise
                  }
                }
              );
            });
          });

          // Execute all promises
          Promise.all(userProjectPromises)
            .then(() => {
              // Commit the transaction
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    reject(err);
                  });
                }
                resolve("Project added successfully with associated users.");
              });
            })
            .catch((err) => {
              // Rollback if any of the user insertions fail
              db.rollback(() => {
                reject(err);
              });
            });
        }
      );
    });
  });
}

module.exports = {
  getUserProjects,
  setFavourite,
  addProject,
};

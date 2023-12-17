const db = require("../config/dbConfig");

async function createTask(
  projectId,
  taskName,
  description,
  statusId,
  complexity,
  dueDate,
  tags = [] // Array of tag IDs
) {
  const insertTaskQuery = `
        INSERT INTO Tasks (project_id, task_name, description, status_id, complexity, due_date)
        VALUES (?, ?, ?, ?, ?, ?);
      `;

  return new Promise((resolve, reject) => {
    db.beginTransaction(async (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Insert the task
      db.query(
        insertTaskQuery,
        [projectId, taskName, description, statusId, complexity, dueDate],
        (err, taskResult) => {
          if (err) {
            return db.rollback(() => {
              reject(err);
            });
          }

          const taskId = taskResult.insertId;

          // Insert tags for the task
          const tagInsertPromises = tags.map((tagId) => {
            return new Promise((resolve, reject) => {
              const insertTagQuery = `
                    INSERT INTO TaskTags (task_id, tag_id)
                    VALUES (?, ?);
                  `;
              db.query(insertTagQuery, [taskId, tagId], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          });

          Promise.all(tagInsertPromises)
            .then(() => {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    reject(err);
                  });
                }
                resolve("Task and tags created successfully");
              });
            })
            .catch((err) => {
              db.rollback(() => {
                reject(err);
              });
            });
        }
      );
    });
  });
}

async function getTasksByProjectId(projectId) {
  const query = `
      SELECT 
        t.*, 
        JSON_ARRAYAGG(JSON_OBJECT('tag_id', tg.tag_id, 'tag_name', tg.tag_name, 'tag_color', tg.tag_color)) AS tags
      FROM 
        Tasks t
      LEFT JOIN 
        TaskTags tt ON t.task_id = tt.task_id
      LEFT JOIN 
        Tags tg ON tt.tag_id = tg.tag_id
      WHERE 
        t.project_id = ?
      GROUP BY 
        t.task_id;
    `;

  return new Promise((resolve, reject) => {
    db.query(query, [projectId], (err, tasks) => {
      if (err) {
        reject(err);
      } else {
        // Transforme les résultats en format JSON pour les tags
        const formattedTasks = tasks.map((task) => ({
          ...task,
          tags: task.tags ? JSON.parse(task.tags) : [],
        }));
        resolve(formattedTasks);
      }
    });
  });
}

async function updateTaskStatus(taskId, newStatusId) {
  const updateQuery = `
      UPDATE Tasks SET status_id = ? WHERE task_id = ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [newStatusId, taskId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Task status updated successfully");
      }
    });
  });
}

async function deleteTask(taskId) {
  const deleteQuery = `
      DELETE FROM Tasks WHERE task_id = ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [taskId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Task deleted successfully");
      }
    });
  });
}

// Fonction pour créer un tag
async function createTag(tagName, tagColor) {
  const insertQuery = `
        INSERT INTO Tags (tag_name, tag_color)
        VALUES (?, ?);
      `;

  return new Promise((resolve, reject) => {
    db.query(insertQuery, [tagName, tagColor], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Tag created successfully");
      }
    });
  });
}

// Fonction pour associer un tag à une tâche
async function addTagToTask(taskId, tagId) {
  const insertQuery = `
        INSERT INTO TaskTags (task_id, tag_id)
        VALUES (?, ?);
      `;

  return new Promise((resolve, reject) => {
    db.query(insertQuery, [taskId, tagId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Tag added to task successfully");
      }
    });
  });
}

// Fonction pour supprimer un tag d'une tâche
async function removeTagFromTask(taskId, tagId) {
  const deleteQuery = `
        DELETE FROM TaskTags
        WHERE task_id = ? AND tag_id = ?;
      `;

  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [taskId, tagId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Tag removed from task successfully");
      }
    });
  });
}

module.exports = {
  createTask,
  getTasksByProjectId,
  updateTaskStatus,
  deleteTask,
  createTag,
  addTagToTask,
  removeTagFromTask,
};

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
        console.log(tasks);
        const formattedTasks = tasks.map((task) => ({
          ...task,
          tags: task.tags ? task.tags : [],
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

// Function to delete a tag
async function deleteTag(tagId) {
  const deleteQuery = `
        DELETE FROM Tags
        WHERE tag_id = ?;
      `;

  return new Promise((resolve, reject) => {
    db.query(deleteQuery, [tagId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Tag deleted successfully");
      }
    });
  });
}

// Function to get tags
async function getTags() {
  const query = `SELECT * FROM Tags;`;

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
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

async function createStatus(status_name) {
  const createStatus = `
      INSERT INTO STATUSES (status_name) VALUES ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(createStatus, [status_name], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("Created status successfully");
      }
    });
  });
}

async function createList(listName, projectId) {
  console.log(listName);
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }

      const statusCheck = `
        SELECT status_id FROM STATUSES WHERE status_name = ?;
      `;
      db.query(statusCheck, [listName], (err, statusRows) => {
        if (err) {
          return db.rollback(() => {
            reject(err);
          });
        }

        let statusId;
        if (statusRows.length === 0) {
          const createStatus = `
            INSERT INTO STATUSES (status_name) VALUES (?);
          `;
          db.query(createStatus, [listName], (err, statusResult) => {
            if (err) {
              return db.rollback(() => {
                reject(err);
              });
            }
            statusId = statusResult.insertId;
            insertList();
          });
        } else {
          statusId = statusRows[0].status_id;
          insertList();
        }

        function insertList() {
          const createList = `
            INSERT INTO Lists (project_id, list_name, status_id) VALUES (?, ?, ?);
          `;
          db.query(
            createList,
            [projectId, listName, statusId],
            (err, result) => {
              if (err) {
                return db.rollback(() => {
                  reject(err);
                });
              }
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    reject(err);
                  });
                }
                resolve("List and status created successfully");
              });
            }
          );
        }
      });
    });
  });
}

async function deleteList(listName, projectId) {
  return new Promise((resolve, reject) => {
    db.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }

      const deleteList = `
        DELETE FROM Lists WHERE project_id = ? AND list_name = ?;
      `;
      db.query(deleteList, [projectId, listName], (err, result) => {
        if (err) {
          return db.rollback(() => {
            reject(err);
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              reject(err);
            });
          }
          resolve("List deleted successfully");
        });
      });
    });
  });
}

async function getListsByProjectId(projectId) {
  const query = `
      SELECT 
      l.list_id,
      l.project_id,
      l.list_name,
      l.status_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'task_id', t.task_id,
          'project_id', t.project_id,
          'list_id', t.list_id,
          'task_name', t.task_name,
          'description', t.description,
          'status_id', t.status_id,
          'complexity', t.complexity,
          'creation_date', t.creation_date,
          'due_date', t.due_date
        )
      ) AS tasks
    FROM 
      Lists l
    LEFT JOIN 
      Tasks t ON l.list_id = t.list_id
    WHERE 
      l.project_id = ?
    GROUP BY 
      l.list_id;
    `;

  return new Promise((resolve, reject) => {
    db.query(query, [projectId], (err, lists) => {
      if (err) {
        reject(err);
      } else {
        const formattedLists = lists.map((list) => {
          let tasks;
          try {
            // Essaie de parser tasks si c'est une chaîne JSON
            tasks = JSON.parse(list.tasks);
          } catch (e) {
            // Si ça échoue, utilise list.tasks tel quel
            tasks = list.tasks;
          }

          return {
            list_id: list.list_id,
            project_id: list.project_id,
            list_name: list.list_name,
            status_id: list.status_id,
            tasks: tasks,
          };
        });
        resolve(formattedLists);
      }
    });
  });
}

async function updateList(listId, newListName, newStatusId) {
  const updateQuery = `
      UPDATE Lists SET list_name = ?, status_id = ? WHERE list_id = ?;
    `;

  return new Promise((resolve, reject) => {
    db.query(updateQuery, [newListName, newStatusId, listId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve("List updated successfully");
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
  deleteTag,
  addTagToTask,
  removeTagFromTask,
  getTags,
  createStatus,
  createList,
  deleteList,
  getListsByProjectId,
  updateList,
};

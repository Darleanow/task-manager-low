const db = require("../config/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(full_name, email, password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query =
    "INSERT INTO Users (full_name, email, password) VALUES (?, ?, ?)";
  return new Promise((resolve, reject) => {
    db.query(query, [full_name, email, hashedPassword], (err, result) => {
      if (err) reject(err);
      resolve("User registered successfully");
    });
  });
}

async function loginUser(email, password) {
  const query =
    "SELECT user_id, full_name, user_role, user_picture, email, password FROM Users WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [email], async (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (validPassword) {
          const user = {
            user_id: results[0].user_id,
            full_name: results[0].full_name,
            user_role: results[0].user_role,
            user_picture: results[0].user_picture,
            email: results[0].email,
          };
          const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: "24h",
          });
          resolve(token);
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
}

async function getUserById(userId) {
  const query = "SELECT full_name, email FROM Users WHERE user_id = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
}

async function getAllusersButID(userId) {
  const query =
    "SELECT full_name, email, user_role, user_picture FROM Users WHERE user_id != ?";
  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results);
      } else {
        resolve(null);
      }
    });
  });
}

async function getUserNotifications(userId) {
  const query =
    "SELECT * FROM Notifications WHERE user_id = ? ORDER BY creation_date DESC;";

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results);
      } else {
        resolve(null);
      }
    });
  });
}

async function setNotificationRead(userId, notificationId) {
  const query =
    "update notifications set is_read = true where notification_id = ? and user_id = ?;";

  return new Promise((resolve, reject) => {
    db.query(query, [notificationId, userId], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve("Worked anyways");
      }
    });
  });
}

async function setAllNotificationRead(userId) {
  const query = "update notifications set is_read = true where user_id = ?;";

  return new Promise((resolve, reject) => {
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
    });
  });
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getAllusersButID,
  getUserNotifications,
  setNotificationRead,
  setAllNotificationRead
};

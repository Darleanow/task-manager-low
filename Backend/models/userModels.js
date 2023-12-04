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
  const query = "SELECT * FROM Users WHERE email = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [email], async (err, results) => {
      if (err) reject(err);
      if (results.length > 0) {
        const validPassword = await bcrypt.compare(
          password,
          results[0].password
        );
        if (validPassword) {
          const token = jwt.sign(
            { user_id: results[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
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

module.exports = { registerUser, loginUser, getUserById };

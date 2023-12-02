// Express package
const express = require("express");
// Mysql package
const mysql = require("mysql2");
// dotenv package
const { config } = require("dotenv");
// bcrypt package
const bcrypt = require("bcrypt");
// Json webtoken package
const jwt = require("jsonwebtoken");
// Cors package
const cors = require("cors");

// App settings
const app = express();
app.use(express.json());
app.use(cors());
config(); // setup dotenv
const PORT = 3333; // Default port used for the server

// Database settings
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Database connection
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Success connecting to MySQL");
});

// Project creation endpoint
app.post("/add_project", (req, res) => {
  const { project_name, project_description } = req.body;

  console.log("data received: ", req.body);

  const query =
    "INSERT INTO projects (project_name, project_description) VALUES (?, ?)";

  db.query(query, [project_name, project_description], (err, result) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send("Erreur lors de l'insertion dans la base de données");
    } else {
      res.status(201).send("Données ajoutées avec succès");
    }
  });
});

// Account registration endpoint
app.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user into the database
    const query =
      "INSERT INTO Users (full_name, email, password) VALUES (?, ?, ?)";
    db.query(query, [full_name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error during user registration");
      } else {
        res.status(201).send("User registered successfully");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// User Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Query the database for the user
  const query = "SELECT * FROM Users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error during login");
    } else if (results.length > 0) {
      // Check if the password is correct
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (validPassword) {
        // Create a token
        const token = jwt.sign(
          { user_id: results[0].user_id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  });
});

// App bootup
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

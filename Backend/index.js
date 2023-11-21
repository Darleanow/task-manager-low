// Express package
const express = require("express");
// Mysql package
const mysql = require("mysql");
// dotenv package
const { config } = require('dotenv');

// App settings
const app = express();
app.use(express.json());
config(); // setup dotenv
const PORT = 3333; // Default port used for the server

// Database settings
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// App bootup
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

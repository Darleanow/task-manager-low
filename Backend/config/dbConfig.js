const mysql = require("mysql2");
const { config } = require("dotenv");
config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        throw err;
    }
    console.log("Success connecting to MySQL");
});

module.exports = db;

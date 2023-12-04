const express = require("express");
const userModel = require("../models/userModel");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();

// Register endpoint
router.post("/register", async (req, res) => {
    const { full_name, email, password } = req.body;
    try {
        const result = await userModel.registerUser(full_name, email, password);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await userModel.loginUser(email, password);
        if (token) {
            res.status(200).json({ token });
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error during login");
    }
});

// Get user endpoint
router.get("/user", authenticateToken, async (req, res) => {
    try {
        const userData = await userModel.getUserById(req.user.user_id);
        if (userData) {
            res.status(200).json(userData);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching user data");
    }
});

module.exports = router;

const express = require("express");
const userModel = require("../models/userModels");
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
router.get("/get_user", authenticateToken, async (req, res) => {
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

router.post("/get_all_users", authenticateToken, async (req, res) => {
  const { user_id } = req.body;
  try {
    const userData = await userModel.getAllusersButID(user_id);
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

router.post("/get_notifications", authenticateToken, async (req, res) => {
  const { user_id } = req.body;
  try {
    const notifications = await userModel.getUserNotifications(user_id);
    if (notifications) {
      res.status(200).json(notifications);
    } else {
      res.status(201).send("Nothing");
    }
  } catch (err) {
    res.status(500).send("Error fetching notifications.");
  }
});

router.post("/read_notification", authenticateToken, async (req, res) => {
  const { user_id, notification_id } = req.body;
  try {
    const response = await userModel.setNotificationRead(
      user_id,
      notification_id
    );
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).send("huh?");
    }
  } catch (err) {
    res.status(500).send("Error reading notifications (xD).");
  }
});

router.post("/read_all_notifications", authenticateToken, async (req, res) => {
  const { user_id } = req.body;
  try {
    const response = await userModel.setAllNotificationRead(user_id);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(200).send("No notifications");
    }
  } catch (err) {
    res.status(500).send("Error fetching notifications.");
  }
});

module.exports = router;

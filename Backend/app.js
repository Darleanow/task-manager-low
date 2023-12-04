const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");

const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");

config(); // setup dotenv
const app = express();

app.use(express.json());
app.use(cors());

app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

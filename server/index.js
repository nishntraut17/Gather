const express = require('express');
require("dotenv").config()
require("./db/connectDB");

const app = express()

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(PORT, () => console.log("Server connected"));
const express = require('express');
const cors = require("cors");
require("dotenv").config()
require("./db/connectDB");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const { v2 } = require("cloudinary");

const app = express();
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
const PORT = process.env.PORT || 5000;

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.listen(PORT, () => console.log("Server connected"));
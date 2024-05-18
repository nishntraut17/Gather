const express = require('express');
const cors = require("cors");
require("dotenv").config()
require("./db/connectDB");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const messageRouter = require("./routes/messageRoutes");
const { v2 } = require("cloudinary");
const { app, server } = require("./socket/socket.js");

app.use(cors({
    origin: [process.env.FRONT_END_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
const PORT = process.env.PORT || 5000;

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/messages", messageRouter);
server.listen(PORT, () => console.log("Server connected"));
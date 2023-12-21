const express = require("express");
const auth = require("../middleware/auth.js");
const { getMessages, sendMessage, getConversations } = require("../controllers/messageController.js");

const messageRouter = express.Router();

messageRouter.get("/conversations", auth, getConversations);
messageRouter.get("/:otherUserId", auth, getMessages);
messageRouter.post("/", auth, sendMessage);

module.exports = messageRouter;

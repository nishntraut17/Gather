const express = require("express");
const {
	createPost,
	deletePost,
	getPost,
	likeUnlikePost,
	replyToPost,
	getFeedPosts,
	getUserPosts,
} = require("../controllers/postController");
const auth = require("../middleware/auth");

const postRouter = express.Router();

postRouter.get("/feed", auth, getFeedPosts);
postRouter.get("/:id", getPost);
postRouter.get("/user/:username", getUserPosts);
postRouter.post("/create", auth, createPost);
postRouter.delete("/:id", auth, deletePost);
postRouter.put("/like/:id", auth, likeUnlikePost);
postRouter.put("/reply/:id", auth, replyToPost);

module.exports = postRouter;

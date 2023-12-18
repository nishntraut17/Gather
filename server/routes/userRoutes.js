const express = require("express");
const {
	followUnFollowUser,
	getUserProfile,
	loginUser,
	signupUser,
	updateUser,
	getSuggestedUsers,
} = require('../controllers/userController.js');
const auth = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/profile/:query", getUserProfile);
userRouter.get("/suggested", auth, getSuggestedUsers);
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/follow/:id", auth, followUnFollowUser); // Toggle state(follow/unfollow)
userRouter.put("/update/:id", auth, updateUser);

module.exports = userRouter;

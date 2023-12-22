const express = require("express");
const {
	followUnFollowUser,
	getUserProfile,
	loginUser,
	signupUser,
	updateUser,
	getSuggestedUsers,
	searchedUsers,
} = require('../controllers/userController.js');
const auth = require("../middleware/auth");
const userRouter = express.Router();

userRouter.get("/profile/:query", getUserProfile);
userRouter.get("/suggested", auth, getSuggestedUsers);
userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.post("/follow/:id", auth, followUnFollowUser);
userRouter.put("/update/:id", auth, updateUser);
userRouter.get("/search/:text", searchedUsers);

module.exports = userRouter;

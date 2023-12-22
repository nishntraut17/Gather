import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            }
        },
        deletePost: (state, action) => {
            return {
                ...state,
                posts: state.posts.filter(item => item._id !== action.payload)
            }
        }
    }
});

export const { setPosts, addPost, deletePost } = postSlice.actions;
export default postSlice.reducer;
export const selectCurrentPosts = (state) => state.post.posts;
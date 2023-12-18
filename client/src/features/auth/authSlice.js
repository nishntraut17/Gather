import { createSlice } from "@reduxjs/toolkit";

const authReducer = createSlice({
    name: "auth",
    initialState: {
        userInfo: {},
    },
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export const { setUserInfo } = authReducer.actions;
export default authReducer.reducer;
export const selectCurrentUser = (state) => state.auth.userInfo;

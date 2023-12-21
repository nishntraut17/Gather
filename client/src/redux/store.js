import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./reducers/apiSlice";
import authReducer from "../features/auth/authSlice";
import conversationReducer from "../features/conversation/conversationSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    conversation: conversationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

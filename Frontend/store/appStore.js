import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import stateReducer from "./stateSlice.js";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    state: stateReducer,
  },
});

export default appStore;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import stateReducer from "./stateSlice.js";
import connectionReducer from "./connectionSlice.js";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    state: stateReducer,
    connections: connectionReducer,
  },
});

export default appStore;

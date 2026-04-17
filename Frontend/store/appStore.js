import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import stateReducer from "./stateSlice.js";
import connectionReducer from "./connectionSlice.js";
import requestReducer from "./requestSlice.js";
import exploreReducer from "./exploreSlice.js";
import postReducer from "./postSlice.js";
import chatSlice from "./chatSlice.js";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    state: stateReducer,
    connections: connectionReducer,
    requests: requestReducer,
    explore: exploreReducer,
    posts: postReducer,
    chats: chatSlice,
  },
});

export default appStore;

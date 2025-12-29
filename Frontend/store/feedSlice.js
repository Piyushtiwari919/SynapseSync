import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    userPrefrencePosts: null,
    extraPosts: null,
  },
  reducers: {
    addFeed: (state, action) => {
      const { userPrefrencePosts, extraPosts } = action.payload;
      state.userPrefrencePosts = userPrefrencePosts;
      state.extraPosts = extraPosts;
    },
    removeFeed: (state, action) => {
      state.userPrefrencePosts = null;
      state.extraPosts = null;
    },
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;

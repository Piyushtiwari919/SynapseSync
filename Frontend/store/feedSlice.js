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
    removeDeletedPost: (state, action) => {
      const newState = state.userPrefrencePosts.filter((post) => {
        return post._id !== action.payload;
      });
      state.userPrefrencePosts = newState;
    },
  },
});

export const { addFeed, removeFeed, removeDeletedPost } = feedSlice.actions;

export default feedSlice.reducer;

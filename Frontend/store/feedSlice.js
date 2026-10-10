import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      const { feed } = action.payload;
      return feed;
    },
    removeFeed: (state, action) => {
      return null;
    },
    removeDeletedPost: (state, action) => {
      const newState = state.filter((post) => {
        return post._id !== action.payload;
      });
      return newState;
    },
  },
});

export const { addFeed, removeFeed, removeDeletedPost } = feedSlice.actions;

export default feedSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: null,
  reducers: {
    addPosts: (state, action) => {
      return action.payload;
    },
    removePosts: (state, action) => {
      return null;
    },
  },
});

export const { addPosts, removePosts } = postSlice.actions;

export default postSlice.reducer;

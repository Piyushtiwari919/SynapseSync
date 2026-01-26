import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: null,
  reducers: {
    addPosts: (state, action) => {
      return action.payload;
    },
    removePosts: (state, action) => {
      const newState = state.filter((post) => post._id !== action.payload);
      return newState;
    },
  },
});

export const { addPosts, removePosts } = postSlice.actions;

export default postSlice.reducer;

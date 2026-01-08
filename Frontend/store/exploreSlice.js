import { createSlice } from "@reduxjs/toolkit";

const exploreSlice = createSlice({
  name: "explore",
  initialState: "null",
  reducers: {
    addFeedUsers: (state, action) => {
      return action.payload;
    },
    removeFeedUsers: (state, action) => {
      return null;
    },
  },
});

export const { addFeedUsers, removeFeedUsers } = exploreSlice.actions;

export default exploreSlice.reducer;

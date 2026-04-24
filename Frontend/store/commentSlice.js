import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "comments",
  initialState: null,
  reducers: {
    addComments: (state, action) => {
      return action.payload;
    },
    removeComment: (state, action) => {
      const newState = state.filter((comment) => {
        return comment._id.toString() !== action.payload.toString();
      });
      return newState;
    },
  },
});

export const { addComments, removeComment } = commentSlice.actions;

export default commentSlice.reducer;

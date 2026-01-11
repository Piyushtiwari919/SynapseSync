import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "state",
  initialState: {
    imageVisibility: false,
    visitedProfileValue: null,
  },
  reducers: {
    toggleImageVisibility: (state, action) => {
      state.imageVisibility = !state.imageVisibility;
    },
    addProfileView: (state, action) => {
      state.visitedProfileValue = action.payload;
    },
    removeProfileView: (state, action) => {
      state.visitedProfileValue = null;
    },
  },
});

export const { toggleImageVisibility, addProfileView, removeProfileView } =
  stateSlice.actions;

export default stateSlice.reducer;

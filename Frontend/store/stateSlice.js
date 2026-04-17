import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
  name: "state",
  initialState: {
    imageVisibility: false,
    visitedProfileValue: null,
    visitedProfileConnections:null
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
    addConnections: (state,action)=>{
      state.visitedProfileConnections = action.payload;
    },
    removeConnections: (state, action)=> {
      state.visitedProfileConnections = null;
    }
  },
});

export const { toggleImageVisibility, addProfileView, removeProfileView, addConnections,removeConnections } =
  stateSlice.actions;

export default stateSlice.reducer;

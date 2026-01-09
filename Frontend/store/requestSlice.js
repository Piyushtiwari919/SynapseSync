import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequestsRecieved: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      const newState = state.filter((connection) => {
        return connection?.fromUserId?._id !== action.payload;
      });
      return newState;
    },
  },
});

export const { addRequestsRecieved, removeRequest } = requestSlice.actions;

export default requestSlice.reducer;

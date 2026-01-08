import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequestsRecieved: (state, action) => {
      return action.payload;
    },
    removeRequest: (state, action) => {
      state = state.filter((connection) => {
        return connection?.fromUserId?._id !== action.payload;
      });
      return state;
    },
  },
});

export const { addRequestsRecieved, removeRequest } = requestSlice.actions;

export default requestSlice.reducer;

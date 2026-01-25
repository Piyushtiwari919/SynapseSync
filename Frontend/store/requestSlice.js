import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    requestsRecieved: null,
    requestsSend: null,
  },
  reducers: {
    addRequestsRecieved: (state, action) => {
      state.requestsRecieved = action.payload;
    },
    removeRequestRecieved: (state, action) => {
      const newState = state.requestsRecieved.filter((connection) => {
        return connection?.fromUserId?._id !== action.payload;
      });
      state.requestsRecieved = newState;
    },
    addRequestsSend: (state, action) => {
      state.requestsSend = action.payload;
    },
    removeRequestSend: (state, action) => {
      const newState = state.requestsSend.filter((connection) => {
        return connection?.toUserId?._id !== action.payload;
      });
      state.requestsSend = newState;
    },
  },
});

export const {
  addRequestsRecieved,
  removeRequestRecieved,
  addRequestsSend,
  removeRequestSend,
} = requestSlice.actions;

export default requestSlice.reducer;

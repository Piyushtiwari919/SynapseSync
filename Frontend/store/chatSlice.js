import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    userChats: null,
    unreadChats: null,
  },
  reducers: {
    addChats: (state, action) => {
      state.userChats = action.payload;
      state.unreadChats = action.payload;
    },
    removeChats: (state, action) => {
      const newState = state.unreadChats.filter((chat) => {
        return chat._id.toString() !== action.payload.toString();
      });
      state.unreadChats = newState;
    },
  },
});


export const {addChats, removeChats} = chatSlice.actions;

export default chatSlice.reducer;
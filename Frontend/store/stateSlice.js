import { createSlice } from "@reduxjs/toolkit";

const stateSlice = createSlice({
    name:"state",
    initialState:{
        imageVisibility:false
    },
    reducers:{
        toggleImageVisibility:(state,action)=>{
            state.imageVisibility = !state.imageVisibility
        }
    }
});

export const {toggleImageVisibility} = stateSlice.actions;

export default stateSlice.reducer;
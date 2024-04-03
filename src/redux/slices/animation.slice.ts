import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AnimationState {
  // Framer Motion animation state
  selectedIot: string;
}

const initialState: AnimationState = {
  selectedIot: "",
};

export const animationSlice = createSlice({
  name: "animation",
  initialState,
  reducers: {
    setSelectedIot: (state, action: PayloadAction<string>) => {
      state.selectedIot = action.payload;
    },
  },
});

export const animationActions = {
	...animationSlice.actions,
};

export default animationSlice.reducer;
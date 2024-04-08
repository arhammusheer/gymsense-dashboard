import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  message: string;
  viewed: boolean;
}

const initialState: Notification[] = [];

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    new: (state, action: PayloadAction<Notification>) => {
      state.push(action.payload);
    },
    viewed: (state, action: PayloadAction<string>) => {
      state[state.findIndex((n) => n.id === action.payload)].viewed = true;
    },
  },
});

export const notificationActions = {
  ...notificationSlice.actions,
};

export default notificationSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "./apis/api.slice";
import { API_BASE_URL } from "./const";
import createSSEMiddleware from "./middleware/sse";
import animationSlice from "./slices/animation.slice";
import authSlice from "./slices/auth.slice";
import notificationSlice from "./slices/notification.slice";

export const anonyID = Math.random().toString(36).substring(7);
const sseMiddleware = createSSEMiddleware(
  `${API_BASE_URL}/notifications?anonyID=${anonyID}`
);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    animation: animationSlice,
    notifications: notificationSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(sseMiddleware);
  },
  devTools: { name: "Gymsense", trace: true, traceLimit: 25 },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector as <T>(
  selector: (state: RootState) => T
) => T;

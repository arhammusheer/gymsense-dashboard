import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../const";
import { anonyID } from "../store";

interface Notification {
  id: string;
  message: string;
  viewed: boolean;
}

interface NotificationState {
  notifications: Notification[];
  focused: boolean;
  isGranted: boolean;
}

interface NotificationResponse {
  status: "success" | "error";
}

interface NotificationPayload {
  iotId: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const notifyWhenAvailable = createAsyncThunk<
  NotificationResponse,
  NotificationPayload,
  {
    rejectValue: AxiosError<{ status: "error"; message: string }>;
  }
>(
  "notification/notifyWhenAvailable",
  async ({ iotId }, { rejectWithValue }) => {
    try {
      return await api
        .post("/notifications", { iotId }, { params: { anonyID: anonyID } })
        .then((res) => res.data)
        .catch((err) => err.response.data as NotificationResponse);
    } catch (err) {
      rejectWithValue(err as AxiosError<{ status: "error"; message: string }>);
    }
  }
);

const initialState: NotificationState = {
  notifications: [],
  focused: false,
  isGranted: false,
};

export const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    return await Notification.requestPermission()
      .then(() => true)
      .catch(() => false);
  }

  return true;
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    new: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      requestNotificationPermission();
    },
    viewed: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.viewed = true;
      }
    },
    focus: (state) => {
      // User browser is focused
      state.focused = true;
    },
    away: (state) => {
      // User browser is away
      state.focused = false;
    },
    requestPermission(state) {
      requestNotificationPermission().then((granted) => {
        state.isGranted = granted;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(notifyWhenAvailable.fulfilled, (state, action) => {
      if (action.payload.status === "success") {
        state.notifications.push({
          id: Math.random().toString(),
          message: "You will be notified when the iot is available",
          viewed: false,
        });
      }
    });
  },
});

export const notificationActions = {
  ...notificationSlice.actions,
  notifyWhenAvailable,
};

export default notificationSlice.reducer;

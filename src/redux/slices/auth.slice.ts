import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

// interface User {
//   token: string;
//   permissions: string[];
//   email: string;
// }

interface AuthState {
  email: string;
  token: string;
  permissions: string[];
  isLoading: boolean;
  error: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  email: "",
  token: "",
  permissions: [],
  isLoading: false,
  error: "",
  isAuthenticated: false,
};

interface LoginResponse {
  token: string;
  user: {
    email: string;
    permissions: string[];
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RejectResponse {
  status: boolean;
  message: string;
}

const axiosAuth = axios.create({
  baseURL: "https://gymsense-api-production.up.railway.app",
  withCredentials: true,
});

// Async thunk for logging in
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: RejectResponse }
>(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosAuth.post("/user/login", { email, password });
      return response.data;
    } catch (err) {
      const error = err as AxiosError; // Specify a more specific type for the error variable
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data as RejectResponse);
    }
  }
);

// Async thunk for registration
export const register = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: RejectResponse }
>(
  "auth/register",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosAuth.post("/user/register", {
        email,
        password,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (!error.response) {
        throw err;
      }
      return rejectWithValue(error.response.data as RejectResponse);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.email = "";
      state.token = "";
      state.permissions = [];
      localStorage.removeItem("user");
    },
    loadState: (state) => {
      const user = localStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        state.email = parsedUser.email;
        state.token = parsedUser.token;
        state.permissions = parsedUser.permissions;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        if ("user" in action.payload) {
          state.email = action.payload.user.email;
          state.token = action.payload.token;
          state.permissions = action.payload.user.permissions;
          state.isAuthenticated = true;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "";
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        if ("user" in action.payload) {
          state.email = action.payload.user.email;
          state.token = action.payload.token;
          state.permissions = action.payload.user.permissions;
          state.isAuthenticated = true;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "";
      });
  },
});

export const authActions = {
  ...authSlice.actions,
  login,
  register,
};
export default authSlice.reducer;

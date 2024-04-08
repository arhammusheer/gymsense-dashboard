import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "../const";

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
  baseURL: API_BASE_URL,
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

// Recover session from httpOnly cookie
export const recoverSession = createAsyncThunk<
  LoginResponse,
  void,
  {
    rejectValue: RejectResponse;
  }
>("auth/recoverSession", async () => {
  const response = await axiosAuth.post("/user/recover");
  return response.data;
});

interface LogoutResponse {
  status: boolean;
}
interface LogoutErrorReponse {
  status: boolean;
  message: string;
}
// Logout action
export const logout = createAsyncThunk<
  LogoutResponse,
  void,
  { rejectValue: LogoutErrorReponse }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosAuth.post("/user/logout");
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (!error.response) {
      throw err;
    }
    return rejectWithValue(error.response.data as LogoutErrorReponse);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Login reducers
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
      // Register reducers
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
    // Recover session reducers
    builder.addCase(recoverSession.fulfilled, (state, action) => {
      state.email = action.payload.user.email;
      state.token = action.payload.token;
      state.permissions = action.payload.user.permissions;
      state.isAuthenticated = true;
    });
    builder.addCase(recoverSession.rejected, (state) => {
      state.isAuthenticated = false;
    });
    builder.addCase(recoverSession.pending, (state) => {
      state.isLoading = true;
    });
    // Logout reducers
    builder.addCase(logout.fulfilled, (state) => {
      state.email = "";
      state.token = "";
      state.permissions = [];
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.error = action.payload?.message || "";
    });
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
  },
});

export const authActions = {
  ...authSlice.actions,
  login,
  register,
  recoverSession,
  logout,
};
export default authSlice.reducer;

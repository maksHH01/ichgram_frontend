import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login, getCurrent, logout, signup } from "./auth-thunks";
import { AuthResponse } from "../../shared/api/auth-api";

export interface IUser {
  _id: string;
  email: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
  bio?: string;
  link?: string;
  verify: boolean;
  followers: string[];
  following: string[];
}

interface AuthState {
  token: string | null;
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem("accessToken"),
  user: null,
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateCurrentUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.token = action.payload.accessToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
      })

      .addCase(getCurrent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrent.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrent.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = (payload as string) || null;
        state.isAuthenticated = false;
      });
  },
});

export const { updateCurrentUser } = authSlice.actions;
export default authSlice.reducer;

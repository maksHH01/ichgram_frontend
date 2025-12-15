import { createAsyncThunk } from "@reduxjs/toolkit";
import { signupUserApi } from "../../shared/api/register-api";

import type { IUser } from "./auth-slice";

import {
  loginUserApi,
  logoutUserApi,
  getCurrentUserApi,
  AuthResponse,
} from "../../shared/api/auth-api";

export interface LoginPayload {
  identifier: string;
  password: string;
}

export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(payload);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const getCurrent = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>("auth/current", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");

    const data = await getCurrentUserApi();

    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logout = createAsyncThunk<boolean, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutUserApi();

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return true;
    } catch (error: any) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

interface SignupResponse {
  message: string;
}

interface SignupPayload {
  email: string;
  password: string;
  fullname: string;
  username: string;
}

export const signup = createAsyncThunk<
  SignupResponse,
  SignupPayload,
  { rejectValue: string }
>("auth/signup", async (payload, { rejectWithValue }) => {
  try {
    const data = await signupUserApi(payload);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

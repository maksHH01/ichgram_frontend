import { createAsyncThunk } from "@reduxjs/toolkit";
import { signupUserApi } from "../../shared/api/register-api";
import { setAuthHeader } from "../../shared/api/setAuthHeader";
import {
  loginUserApi,
  logoutUserApi,
  getCurrentUserApi,
} from "../../shared/api/auth-api";

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await loginUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getCurrent = createAsyncThunk(
  "auth/current",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) throw new Error("No token found");
      const data = await getCurrentUserApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      if (!auth.token) throw new Error("No token found");
      await logoutUserApi();
      setAuthHeader(null);
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await signupUserApi(payload);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

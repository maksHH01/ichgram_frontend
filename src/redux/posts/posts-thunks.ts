import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPostsByUsername, createNewPost } from "../../shared/api/posts-api";

export const fetchPostsByUsername = createAsyncThunk(
  "posts/fetchByUsername",
  async (username, thunkAPI) => {
    try {
      const posts = await getPostsByUsername(username);
      return posts;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load posts");
    }
  }
);

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async ({ formData, token }, thunkAPI) => {
    try {
      const newPost = await createNewPost(formData, token);
      return newPost;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to add post");
    }
  }
);

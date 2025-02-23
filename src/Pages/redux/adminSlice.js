import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("http://localhost:5000/api/public/posts"); // Your backend endpoint
  return response.data;
});

// Fetch All Questions
export const fetchQuestions = createAsyncThunk("questions/fetchQuestions", async () => {
  const response = await axios.get("http://localhost:5000/api/public/questions"); // Your backend endpoint
  return response.data;
});

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    questions: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
    builder
    .addCase(fetchPosts.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    posts: [],
    questions: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchQuestions.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchQuestions.fulfilled, (state, action) => {
      state.loading = false;
      state.questions = Array.isArray(action.payload) ? action.payload : [];
    })
    .addCase(fetchQuestions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const postsReducer = postsSlice.reducer;
export const questionsReducer = questionsSlice.reducer;




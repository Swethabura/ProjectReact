import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch All Posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("http://localhost:5000/api/public/posts"); // Your backend endpoint
  return response.data;
});

// Add New Post
export const addPost = createAsyncThunk("posts/addPost", async (newPost) => {
  const response = await axios.post("http://localhost:5000/api/public/posts", newPost);
  return response.data; // Returns the newly created post
});

// Fetch All Questions
export const fetchQuestions = createAsyncThunk("questions/fetchQuestions", async () => {
  const response = await axios.get("http://localhost:5000/api/public/questions"); // Your backend endpoint
  return response.data;
});

// Add New Question
export const addQuestion = createAsyncThunk("questions/addQuestion", async (newQuestion) => {
  const response = await axios.post("http://localhost:5000/api/public/questions", newQuestion);
  return response.data; // Returns the newly created post
});


const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
    // Fetch Posts Cases
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
    // Add Post Cases
    .addCase(addPost.pending, (state) => {
      state.loading = true;
    })
    .addCase(addPost.fulfilled, (state, action) => {
      state.loading = false;
      state.posts.unshift(action.payload); // Add new post to the start of the list
    })
    .addCase(addPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
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
    })
    // Add question Cases
    .addCase(addQuestion.pending, (state) => {
      state.loading = true;
    })
    .addCase(addQuestion.fulfilled, (state, action) => {
      state.loading = false;
      state.questions.unshift(action.payload); // Add new question to the start of the list
    })
    .addCase(addQuestion.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const postsReducer = postsSlice.reducer;
export const questionsReducer = questionsSlice.reducer;




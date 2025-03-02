import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;; // Replace with your backend URL

// Fetch user collection (saved posts, saved answers, my posts, my answers)
export const fetchUserCollection = createAsyncThunk(
  "userCollection/fetchUserCollection",
  async (accountUsername, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/public/user-collection/${accountUsername}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching user collection");
    }
  }
);

// Save a post
export const savePost = createAsyncThunk(
  "userCollection/savePost",
  async ({ accountUsername, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/user-collection/save-post`, { accountUsername, postId });
      return response.data.savedPosts; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error saving post");
    }
  }
);

// Unsave a post
export const unsavePost = createAsyncThunk(
  "userCollection/unsavePost",
  async ({ accountUsername, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/user-collection/unsave-post`, { accountUsername, postId });
      return response.data.savedPosts; // Return updated saved posts array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error unsaving post");
    }
  }
);

// Save an answer
export const saveAnswer = createAsyncThunk(
  "userCollection/saveAnswer",
  async ({ accountUsername, answerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/user-collection/save-answer`, { accountUsername, answerId });
      return response.data.savedAnswers; // Updated saved answers array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error saving answer");
    }
  }
);

// Unsave an answer
export const unsaveAnswer = createAsyncThunk(
  "userCollection/unsaveAnswer",
  async ({ accountUsername, answerId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/user-collection/unsave-answer`, { accountUsername, answerId });
      return response.data.savedAnswers; // Updated saved answers array
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error unsaving answer");
    }
  }
);

// Fetch answers by IDs
export const fetchAnswersByIds = createAsyncThunk(
  "userCollection/fetchAnswersByIds",
  async (answerIds, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/answers/by-ids`, { answerIds });
      return response.data; // Returns the filtered answers
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching answers");
    }
  }
);

const userCollectionSlice = createSlice({
  name: "userCollection",
  initialState: {
    savedPosts: [],
    savedAnswers: [],
    myPosts: [],
    myAnswers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.savedPosts = action.payload.savedPosts;
        state.savedAnswers = action.payload.savedAnswers;
        state.myPosts = action.payload.myPosts;
        state.myAnswers = action.payload.myAnswers;
      })
      .addCase(fetchUserCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // to save a post
      .addCase(savePost.fulfilled, (state, action) => {
        if (state.userCollection) {
          state.userCollection.savedPosts = action.payload; 
        }
      })
      // to unsave a post
      .addCase(unsavePost.fulfilled, (state, action) => {
        state.savedPosts = action.payload; 
      })
      // Save Answer
      .addCase(saveAnswer.fulfilled, (state, action) => {
        if (state.userCollection) {
          state.userCollection.savedAnswers = action.payload;
        }
      })
      // Unsave Answer
      .addCase(unsaveAnswer.fulfilled, (state, action) => {
        state.savedAnswers = action.payload;
      });
  },
});

export default userCollectionSlice.reducer;

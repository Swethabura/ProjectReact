import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Fetch admin stats
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${apiUrl}/admin/stats`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch admin posts
export const fetchAdminPosts = createAsyncThunk(
  "admin/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${apiUrl}/admin/posts`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Fetch admin questions
export const fetchAdminQuestions = createAsyncThunk(
  "admin/fetchQuestions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${apiUrl}/admin/questions`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// Delete Question (Admin)
export const adminDeleteQuestion = createAsyncThunk(
  "admin/deleteQuestion",
  async (questionId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/admin/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return questionId; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Delete Post (Admin)
export const adminDeletePost = createAsyncThunk(
  "admin/deletePost",
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/admin/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    posts: [],
    questions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch post through admin protection
      .addCase(fetchAdminPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // fetch all questions through admin protection
      .addCase(fetchAdminQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdminQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Question
      .addCase(adminDeleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(q => q._id !== action.payload);
      })
      .addCase(adminDeleteQuestion.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete Post
      .addCase(adminDeletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload);
      })
      .addCase(adminDeletePost.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});
export default adminSlice.reducer;

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
      });
  },
});
export default adminSlice.reducer;

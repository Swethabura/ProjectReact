import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Async action to fetch profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (loggedInUser, { rejectWithValue }) => {
    // Accept loggedInUser here
    try {
      const response = await axios.get(
        `${apiUrl}/public/profile/${loggedInUser}`
      );
      return response.data; // Make sure backend returns profile + savedPosts + myPosts
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Something went wrong" }
      );
    }
  }
);

// Async action to update profile data
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/public/profile`,
        profileData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Update failed" }
      );
    }
  }
);

// to save the post
export const savePost = createAsyncThunk(
  "profile/savePost",
  async ({ accountUsername, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/profile/save-post`, { accountUsername, postId });
      return postId; // Return postId to update Redux state
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Unsave a post
export const unsavePost = createAsyncThunk(
  "profile/unsavePost",
  async ({ accountUsername, postId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/profile/unsave-post`, { accountUsername, postId });
      return response.data.savedPosts; // Return updated savedPosts array
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);


const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = {
          ...action.payload.profile, // Access `profile` inside API response
          savedPosts: action.payload.profile.savedPosts || [],
          myPosts: action.payload.profile.myPosts || [],
        };
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.profile; // ✅ Update entire profile
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unsavePost.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.savedPosts = action.payload; // Update savedPosts in Redux state
        }
      });
  },
});

export default profileSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (loggedInUser, { rejectWithValue }) => {
    // ✅ Accept loggedInUser here
    try {
      const response = await axios.get(
        `http://localhost:5000/api/public/profile/${loggedInUser}`
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
        `http://localhost:5000/api/public/profile`,
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

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null, // ✅ Store everything inside profile
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
      });
  },
});

export default profileSlice.reducer;

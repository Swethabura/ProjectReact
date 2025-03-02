import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Fetch profile data
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (loggedInUser, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/public/profile/${loggedInUser}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
  }
);

// Update profile data
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      let updatedProfile = { ...profileData };

      // Upload profile picture if it's a File object
      if (profileData.profilePic instanceof File) {
        const formData = new FormData();
        formData.append("profilePic", profileData.profilePic);

        const uploadResponse = await axios.post(`${apiUrl}/public/profile-pic/upload-url`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        updatedProfile.profilePic = uploadResponse.data.filePath; // Store only URL
      }

      // Send updated profile data to backend
      const response = await axios.put(`${apiUrl}/public/profile`, updatedProfile);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Update failed" });
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null, // Only basic profile details
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
        state.profile = action.payload.profile; // Store only profile data
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
        state.profile = action.payload.profile; // Update profile state
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;

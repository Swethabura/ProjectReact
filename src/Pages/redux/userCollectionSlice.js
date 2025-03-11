import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL; // Replace with your backend URL

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

// to delete post id from my-post
export const deleteMyPost = createAsyncThunk(
  "userCollection/deleteMyPost",
  async ({ postId, accountUsername }, { getState, rejectWithValue }) => {
    try {
      // API call to delete the post
      await axios.delete(`${apiUrl}/public/posts/delete`, {
        data: { postId, accountUsername }, // Send postId & username in body
      });

      // Update myPosts state in Redux store
      const { myPosts } = getState().userCollection;
      return myPosts.filter((id) => id !== postId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error deleting post");
    }
  }
);

// To delete question ID from myQuestions
export const deleteMyQuestion = createAsyncThunk(
  "userCollection/deleteMyQuestion",
  async ({ questionId, accountUsername }, { getState, rejectWithValue }) => {
    try {
      // API call to delete the question
      await axios.delete(`${apiUrl}/public/question/deleteQuestion`, {
        data: { questionId, accountUsername }, // Send questionId & username in body
      });

      // Update myQuestions state in Redux store
      const { myQuestions } = getState().userCollection;
      return myQuestions.filter((id) => id !== questionId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error deleting question");
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
    myQuestions: [],
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
        state.myQuestions = action.payload.myQuestions;
      })
      .addCase(fetchUserCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // to save a post
      .addCase(savePost.fulfilled, (state, action) => {
        if (state.userCollection) {
          state.savedPosts = action.payload; 
        }
      })
      // to unsave a post
      .addCase(unsavePost.fulfilled, (state, action) => {
        state.savedPosts = action.payload; 
      })
      // Save Answer
      .addCase(saveAnswer.fulfilled, (state, action) => {
        if (state.userCollection) {
          state.savedAnswers = action.payload;
        }
      })
      // Unsave Answer
      .addCase(unsaveAnswer.fulfilled, (state, action) => {
        state.savedAnswers = action.payload;
      })
      // to delete id from my-post
      .addCase(deleteMyPost.fulfilled, (state, action) => {
        state.myPosts = action.payload; // Remove from myPosts
      })
      // to delete id from my-questions
      .addCase(deleteMyQuestion.fulfilled, (state, action) => {
        state.myQuestions = action.payload;
      })
      .addCase(deleteMyQuestion.rejected, (state, action) => {
        console.error("Failed to delete question:", action.payload);
      });
  },
});

export default userCollectionSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Fetch All Posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(`${apiUrl}/public/posts`); 
  return response.data;
});

// Add New Post
export const addPost = createAsyncThunk("posts/addPost", async (newPost) => {
  const response = await axios.post(`${apiUrl}/public/posts`, newPost);
  return response.data; // Returns the newly created post
});

// Fetch All Questions
export const fetchQuestions = createAsyncThunk("questions/fetchQuestions", async () => {
  const response = await axios.get(`${apiUrl}/public/questions`); 
  return response.data;
});

// Add New Question
export const addQuestion = createAsyncThunk("questions/addQuestion", async (newQuestion) => {
  const response = await axios.post(`${apiUrl}/public/questions`, newQuestion);
  return response.data; // Returns the newly created post
});

// To add or delete the like
export const updateLike = createAsyncThunk("posts/updateLike", async ({ postId, userId }) => {
  const response = await axios.put(`h${apiUrl}/public/like/${postId}`, { userId });
  return response.data;
});

// Add Comment to a Post
export const addPostComment = createAsyncThunk(
  "posts/addPostComment",
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/public/post/${postId}/comments`, comment);
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// to delete a post
export const deletePost = createAsyncThunk("posts/deletePost", async (postId, { getState, rejectWithValue }) => {
  try {
    // API call to delete the post
    await axios.delete(`${apiUrl}/public/posts/${postId}`);

    // Update state after successful deletion
    const { posts } = getState().posts;
    return posts.filter((post) => post._id !== postId);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error deleting post");
  }
});

// to delete a post
export const deleteQuestion = createAsyncThunk("questions/deleteQuestion", async (postId, { getState, rejectWithValue }) => {
  try {
    // API call to delete the question
    await axios.delete(`${apiUrl}/public/question/${postId}`);

    // Update state after successful deletion
    const { questions } = getState().questions;
    return questions.filter((question) => question._id !== postId);
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Error deleting post");
  }
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
    })
    .addCase(updateLike.fulfilled, (state, action) => {
      const index = state.posts.findIndex((post) => post._id === action.payload._id);
      if (index !== -1) {
        // Update only the likes field, keeping other data intact
        state.posts[index] = {
          ...state.posts[index], // Keep existing post structure
          likes: action.payload.likes, // Update like count
          likedBy: action.payload.likedBy, // Update likedBy array
        };
      }
    })
    // Add Comment
    .addCase(addPostComment.fulfilled, (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find((p) => p._id === postId);
      if (post) {
        post.comments.unshift(comment); // Add new comment to top
      }
    })
    // to delete post
    .addCase(deletePost.fulfilled, (state, action) => {
      state.posts = action.payload; // Update Redux state
    })
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
    })
    // to delete question
    .addCase(deleteQuestion.fulfilled, (state, action) => {
      state.questions = action.payload; // Update Redux state
    })
  },
});

export const postsReducer = postsSlice.reducer;
export const questionsReducer = questionsSlice.reducer;




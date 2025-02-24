import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Add New Answer
export const addAnswer = createAsyncThunk(
  "answers/addAnswer",
  async (newAnswer) => {
    const response = await axios.post(
      "http://localhost:5000/api/public/answers",
      newAnswer
    );
    return response.data; // Returns the newly created answer
  }
);

// Fetch Answers for a Question
export const fetchAnswers = createAsyncThunk(
  "answers/fetchAnswers",
  async (questionId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/public/${questionId}`
      );
      return { questionId, answers: response.data }; // Return questionId to update specific question
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const answersSlice = createSlice({
  name: "answers",
  initialState: {
    answers: {}, // Store answers by question ID
    loading: false,
    error: null,
  },
  reducers: {}, // No extra reducers needed for now
  extraReducers: (builder) => {
    builder
      // Fetch Answers Cases
      .addCase(fetchAnswers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.loading = false;
        state.answers[action.payload.questionId] = action.payload.answers; // Store answers under the respective question ID
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Answer Cases
      .addCase(addAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAnswer.fulfilled, (state, action) => {
        state.loading = false;
        const { questionId, ...answerData } = action.payload;
        if (!state.answers[questionId]) {
          state.answers[questionId] = [];
        }
        state.answers[questionId].unshift(answerData);
      })
      .addCase(addAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const answersReducer = answersSlice.reducer;

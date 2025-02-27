import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

// Add New Answer
export const addAnswer = createAsyncThunk(
  "answers/addAnswer",
  async (newAnswer) => {
    const response = await axios.post(
      `${apiUrl}/public/answers`,
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
        `${apiUrl}/public/${questionId}`
      );
      return { questionId, answers: response.data }; // Return questionId to update specific question
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Adding comments to an answer
export const addAnswerComment = createAsyncThunk(
  "answers/addAnswerComment",
  async ({ answerId, userId, text }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${apiUrl}/public/answers/${answerId}/comments`,
        { userId, text }
      );
      return { answerId, comment: response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error adding comment"
      );
    }
  }
);

// To add or delete the vote
export const updateVote = createAsyncThunk(
  "answers/updateVote",
  async ({ answerId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${apiUrl}/public/vote/${answerId}`,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Vote update failed!");
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
      })
      // Add Answer Comment Cases
      .addCase(addAnswerComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAnswerComment.fulfilled, (state, action) => {
        state.loading = false;
        const { answerId, comment } = action.payload;

        // Find the questionId associated with the answerId
        for (let questionId in state.answers) {
          const answer = state.answers[questionId].find(
            (a) => a._id === answerId
          );
          if (answer) {
            // Ensure comments array exists
            if (!answer.comments) {
              answer.comments = [];
            }
            // Add the new comment
            answer.comments.push({
              text: comment.text,
              userId: comment.userId,
            });
            break; // Exit loop once the answer is found
          }
        }
      })
      .addCase(updateVote.fulfilled, (state, action) => {
      
        const updatedAnswer = action.payload; // The entire updated answer object
        const { questionId } = updatedAnswer; // Ensure the answer object contains questionId
      
        if (state.answers[questionId]) {
          const answerIndex = state.answers[questionId].findIndex(
            (a) => a._id === updatedAnswer._id
          );
      
          if (answerIndex !== -1) {
            // Update the specific answer in the state
            state.answers[questionId][answerIndex] = updatedAnswer;
          }
        }
      })
      .addCase(updateVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.error("Vote update failed:", action.error); // Log the error
      });
  },
});

export const answersReducer = answersSlice.reducer;

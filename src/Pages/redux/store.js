import { configureStore } from "@reduxjs/toolkit";
import {postsReducer,questionsReducer} from "./userSlice";
import adminReducer from "./adminSlice"
import { answersReducer } from "./answersSlice";

const store = configureStore({
    reducer : {
        posts: postsReducer,
        questions: questionsReducer,
        admin: adminReducer,
        answers: answersReducer,
    },
});

export default store;
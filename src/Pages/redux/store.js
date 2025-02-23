import { configureStore } from "@reduxjs/toolkit";
import {postsReducer,questionsReducer} from "./adminSlice"

const store = configureStore({
    reducer : {
        posts: postsReducer,
        questions: questionsReducer
    },
});

export default store;
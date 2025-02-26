import { configureStore } from "@reduxjs/toolkit";
import {postsReducer,questionsReducer} from "./userSlice";
import adminReducer from "./adminSlice"
import { answersReducer } from "./answersSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
    reducer : {
        posts: postsReducer,
        questions: questionsReducer,
        admin: adminReducer,
        answers: answersReducer,
        profile: profileReducer
    },
});

export default store;
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainNav from "./MainNav"
import Feed from "./Feed"
import Questions from "./Questions";
import FloatingButton from "./FloatingBtn";
import { posts as initialPosts } from "./dummydata";
import { message } from "antd";


function MainPage(){
  // Load posts from localStorage or use initialPosts if empty
  const [messageApi,contextHolder] = message.useMessage();

  const loggedInUser = localStorage.getItem("LoggedInUser")

  const success = () => {
    messageApi.open({
      type: "success",
      content: `Welcome ${loggedInUser}`,
    });
  };

  useEffect(() => {
    const hasShownMessage = sessionStorage.getItem("hasShownWelcomeMessage");
  
    if (loggedInUser && !hasShownMessage) {
      success();
      sessionStorage.setItem("hasShownWelcomeMessage", "true"); // Set flag for this session
    }
  }, []);

  const [posts, setPosts] = useState(() => {
    success()
    const savedPosts = localStorage.getItem("posts");
    // return savedPosts ? JSON.parse(savedPosts) : initialPosts;
  });
  
  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    // return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  // Function to add a new question and update state immediately
  const addNewQuestion = useCallback((newQuestion) => {
    setQuestions((prevQuestions) => {
      // Merge previous questions (preserving answers) with the new question
      const updatedQuestions = [
        { ...newQuestion, answers: [] },  // Ensure new question starts with empty answers
        ...prevQuestions.map(q => ({ ...q }))  // Keep previous questions with their answers
      ];
  
      localStorage.setItem("questions", JSON.stringify(updatedQuestions));  // Save to localStorage
      return updatedQuestions;
    });
  }, []);
  
  // Save posts to localStorage whenever they change
  useEffect(()=>{
    localStorage.setItem("posts", JSON.stringify(posts));
  },[posts])

  // Function to add a new post
  const addNewPost = useCallback((newPost) => {
    setPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts];
      localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Save immediately
      return updatedPosts;
    });
  }, []);

  const updatePosts = (updatedPosts) =>{
    setPosts(updatedPosts);
    localStorage.setItem("posts",JSON.stringify(updatedPosts));
  };

  return(
    <div>
      <MainNav />
      {contextHolder}
      <Routes>
        <Route path="/" element={<Navigate to="feed" replace />} />  {/* Default to feed */}
        <Route path="feed" element={<Feed  updatePosts={updatePosts}/>} />
        <Route path="questions" element={<Questions setQuestions={setQuestions}/>} />
      </Routes>
      <FloatingButton key={location.pathname}/>
      ;
    </div>
  )
}

export default MainPage
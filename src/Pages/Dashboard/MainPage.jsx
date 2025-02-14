import React, { useState, useCallback, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainNav from "./MainNav"
import Feed from "./Feed"
import Questions from "./Questions";
import FloatingButton from "./FloatingBtn";
import { posts as initialPosts } from "./dummydata";


function MainPage(){
  // Load posts from localStorage or use initialPosts if empty
  const [posts, setPosts] = useState(() => {
    const savedPosts = localStorage.getItem("posts");
    return savedPosts ? JSON.parse(savedPosts) : initialPosts;
  });

  const [questions, setQuestions] = useState(() => {
    const savedQuestions = localStorage.getItem("questions");
    return savedQuestions ? JSON.parse(savedQuestions) : [];
  });
  
  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const addNewQuestion = useCallback((newQuestion) => {
    setQuestions((prevQuestions) => [newQuestion, ...prevQuestions]);
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
      <Routes>
        <Route path="/" element={<Navigate to="feed" replace />} />  {/* Default to feed */}
        <Route path="feed" element={<Feed posts={posts} updatePosts={updatePosts}/>} />
        <Route path="questions" element={<Questions questions={questions}/>} />
      </Routes>
      <FloatingButton key={location.pathname} addNewPost={location.pathname === "/main/feed" ? addNewPost : null}
        addNewQuestion={location.pathname === "/main/questions" ? addNewQuestion : null}/>

    </div>
  )
}

export default MainPage
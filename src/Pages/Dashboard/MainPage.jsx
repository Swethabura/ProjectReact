import React, { useState, useCallback, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainNav from "./MainNav"
import Feed from "./Feed"
import Questions from "./Questions";
import FloatingButton from "./FloatingBtn";
import { message } from "antd";
import EditProfile from "./Profile/EditProfile";
import Profile from "./Profile/Profile";
import PostDetails from "./Profile/PostDetails";
import Collection from "./Profile/Collection";



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

  return(
    <div>
      <MainNav />
      {contextHolder}
      <Routes>
        <Route path="/" element={<Navigate to="feed" replace />} />  {/* Default to feed */}
        <Route path="feed" element={<Feed />} />
        <Route path="questions" element={<Questions/>} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="my-profile" element={<Profile />} />
        <Route path="collection" element={<Collection />} />
        <Route path="post/:postId" element={<PostDetails />} />
      </Routes>
      <FloatingButton key={location.pathname}/>
      ;
    </div>
  )
}

export default MainPage
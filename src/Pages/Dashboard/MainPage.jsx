import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import MainNav from "./MainNav";
import Sidebar from "./Sidebar"; // New Sidebar component
import Feed from "./Feed";
import Questions from "./Questions";
import FloatingButton from "./FloatingBtn";
import { message } from "antd";
import Profile from "./Profile/Profile";
import PostDetails from "./Profile/PostDetails";
import Collection from "./Profile/Collection";
import '../../Styles/MainPage.css'

function MainPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const location = useLocation();

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
      sessionStorage.setItem("hasShownWelcomeMessage", "true");
    }
  }, []);

  return (
    <div className="main-container">
      {/* Sidebar (Only visible on desktop) */}
      <aside className="sidebar">
        <Sidebar />
      </aside>
      {/* Main Content */}
      <div className="content-container">
        <MainNav />
        {contextHolder}
        <Routes>
          <Route path="/" element={<Navigate to="feed" replace />} />
          <Route path="feed" element={<Feed />} />
          <Route path="questions" element={<Questions />} />
          <Route path="my-profile" element={<Profile />} />
          <Route path="collection" element={<Collection />} />
          <Route path="post/:postId" element={<PostDetails />} />
        {/* Handle unknown routes */}
        <Route path="*" element={<p>Page Not Found</p>} />
        </Routes>
        <FloatingButton key={location.pathname} />
      </div>
    </div>
  );
}

export default MainPage;

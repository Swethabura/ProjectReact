import React, { useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
import DashboardHome from "./DashboardHome";
import { Routes, Route, Navigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import PostManagement from "./PostManagement";
import QuestionManagement from "./QuestionManagement";
import { message } from "antd";

const AdminDashboard = () => {
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi, contextHolder] = message.useMessage();

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
  return (
    <>
          {contextHolder}
      <AdminNavbar />
      <div style={{ padding: "20px", color: "black" }}>
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="posts" element={<PostManagement />} />
          <Route path="questions" element={<QuestionManagement />} />
        </Routes>
      </div>
    </>
  );
};

export default AdminDashboard;

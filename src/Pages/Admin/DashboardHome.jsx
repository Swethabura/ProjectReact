import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../redux/adminSlice";
import { Spin } from "antd";
import "./AdminDashboard.css"; // Import the new CSS file

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading)
    return (
      <div className="spinner-container">
        <Spin size="large" />
      </div>
    );

  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="dashboard-home">
      <h1 style={{  color:"var(--primary-color)", textAlign:"center", padding:"0.5rem 0 2rem 0", fontWeight:"900"}}>Platform Overview</h1>
      <div className="stats-container">
        {[
          { title: "Total Users", value: stats?.totalUsers || 0 },
          { title: "Total Posts", value: stats?.totalPosts || 0 },
          { title: "Total Questions", value: stats?.totalQuestions || 0 },
          { title: "Total Answers", value: stats?.totalAnswers || 0 },
          { title: "Total Likes", value: stats?.totalLikes || 0 },
          { title: "Total Votes", value: stats?.totalVotes || 0 },
        ].map((stat, index) => (
          <div className="stat-box" key={index}>
            <h4 style={{ fontFamily: "'Inter', sans-serif", color:"var(--primary-color)"}}>{stat.title}</h4>
            <p style={{ fontFamily: "'Inter', sans-serif"}}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;

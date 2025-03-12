import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../redux/adminSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Platform Overview</h3>
      <div className="stats-container">
        <div className="stat-box">
          <h4>Total Users</h4>
          <p>{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-box">
          <h4>Total Posts</h4>
          <p>{stats?.totalPosts || 0}</p>
        </div>
        <div className="stat-box">
          <h4>Total Questions</h4>
          <p>{stats?.totalQuestions || 0}</p>
        </div>
        <div className="stat-box">
          <h4>Total Answers</h4>
          <p>{stats?.totalAnswers || 0}</p>
        </div>
        <div className="stat-box">
          <h4>Total Likes</h4>
          <p>{stats?.totalLikes || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

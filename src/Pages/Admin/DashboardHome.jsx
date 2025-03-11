import React from 'react';

const DashboardHome = () => {
  return (
    <div>
      <h3>Platform Overview</h3>
      <div className="stats-container">
        <div className="stat-box">
          <h4>Total Users</h4>
          <p>120</p>
        </div>
        <div className="stat-box">
          <h4>Total Posts</h4>
          <p>340</p>
        </div>
        <div className="stat-box">
          <h4>Total Questions</h4>
          <p>150</p>
        </div>
        <div className="stat-box">
          <h4>Total Answers</h4>
          <p>520</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

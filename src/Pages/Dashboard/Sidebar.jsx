import React, { useState } from "react";
import "../../Styles/Sidebar.css";
import {
  ProfileOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

const Sidebar = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // Handle logout
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("LoggedInUser"); // Remove user data from localStorage
    setIsModalVisible(false);
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* Sidebar (Visible only on larger screens) */}
      <div className="sidebar">
        <div className="sidebar-content">
          <p
            onClick={() => navigate("/main/my-profile")}
            className="sidebar-btn"
          >
            <ProfileOutlined /> My Profile
          </p>
          <p
            onClick={() => navigate("/main/collection")}
            className="sidebar-btn"
          >
            <BookOutlined /> Collection
          </p>
          <p onClick={showLogoutConfirm} className="sidebar-btn">
            <LogoutOutlined /> Logout
          </p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title={
          <span
            style={{ fontFamily: "'Inter', sans-serif", color: "var(--primary-color)" }}
          >
            Confirm Logout
          </span>
        }
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes, Logout"
        cancelText={<span style={{ color: "black" }}>Cancel</span>}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
};

export default Sidebar;

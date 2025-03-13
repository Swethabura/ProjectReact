import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AdminNavbar.css";
import { FiMoon, FiSun } from "react-icons/fi";
import { LogoutOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import logoLight from "../../assets/devconnect (2).png";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Toggle Theme Mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Toggle Sidebar Menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Handle Logout
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
    setIsLogoutOpen(!isLogoutOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("LoggedInUser");
    setIsModalVisible(false);
    navigate("/login");
  };

  // Function to Navigate and Close Menu
  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        {/* Left Section - Logo and Heading */}
        <div className="navbar-left">
          <img src={logoLight} alt="logo" width={60} height={60} />
          <h2>DevConnect</h2>
        </div>

        {/* Center Section - Navigation Links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          {[
            { path: "/admin/dashboard", label: "Dashboard" },
            { path: "/admin/users", label: "Users" },
            { path: "/admin/posts", label: "Posts" },
            { path: "/admin/questions", label: "Questions" },
          ].map(({ path, label }) => (
            <button
              key={path}
              className={`link ${location.pathname === path ? "active" : ""}`}
              onClick={() => handleNavigation(path)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right Section - Theme Toggle & Logout */}
        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? <FiMoon size={22} /> : <FiSun size={22} />}
          </button>
          <button className="logout-btn" onClick={showLogoutConfirm}>
            <LogoutOutlined /> <span className="adminLogout">Logout</span> 
          </button>
        </div>

        {/* Hamburger Menu */}
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        title={
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "var(--primary-color)",
            }}
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
    </nav>
  );
};

export default AdminNavbar;

import React, { useEffect, useState } from "react";
import { Drawer, Avatar, Button, Switch, Modal } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  LogoutOutlined,
  FileImageOutlined,
  ProfileOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "../../Styles/MainNav.css"; // Import your CSS file
import { fetchProfile } from "../redux/profileSlice";

const MainNav = () => {
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false); // Control the mobile menu
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const { loading, error, profile } = useSelector((state) => state.profile);

  // Effect to apply the theme to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("click", closeMenuOnClickOutside);
    } else {
      document.removeEventListener("click", closeMenuOnClickOutside);
    }
    return () => document.removeEventListener("click", closeMenuOnClickOutside);
  }, [menuOpen]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Handle logout
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
    closeDrawer();
  };

  const handleLogout = () => {
    localStorage.removeItem("LoggedInUser"); // Remove user data from localStorage
    setIsModalVisible(false); // Close the modal
    navigate("/login"); // Redirect to login page
  };

  const closeMenuOnClickOutside = (e) => {
    if (!e.target.closest(".mobile-menu") && !e.target.closest(".menu-icon")) {
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      {/* Left: User Avatar */}
      <div className="navleft">
      <Avatar
              size="large"
              src={profile?.profilePic ? profile?.profilePic : null}
              icon={!profile?.profilePic ? <UserOutlined /> : null}
            />
      <h1 className="userName">{loggedInUser}</h1>

</div>
      {/* Center: Navigation Links (Hidden in mobile) */}
      <div className="nav-links">
        <Button
          type="link"
          onClick={() => navigate("/main/feed")}
          className={`link ${
            location.pathname === "/main/feed" ? "active" : ""
          }`}
        >
          Feed
        </Button>
        <Button
          type="link"
          onClick={() => navigate("/main/questions")}
          className={`link ${
            location.pathname === "/main/questions" ? "active" : ""
          }`}
        >
          Questions
        </Button>
        {/* <Button
          type="link"
          onClick={() => navigate("/main/maincommunity")}
          className={`link ${
            location.pathname === "/main/maincommunity" ? "active" : ""
          }`}
        >
          Community
        </Button> */}
      </div>

      {/* Right: Theme Toggle & Hamburger */}
      <div className="nav-right">
        <Switch
          checked={theme === "dark"}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          className="switch-theme"
        />
        <MenuOutlined className="menu-icon" onClick={toggleMenu} />
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <Button
            type="link"
            onClick={() => {
              navigate("/main/feed");
              setMenuOpen(false);
            }}
            className="mobile-link"
          >
            Feed
          </Button>
          <Button
            type="link"
            onClick={() => {
              navigate("/main/questions");
              setMenuOpen(false);
            }}
            className="mobile-link"
          >
            Questions
          </Button>
          <Button
            type="link"
            onClick={() => {
              navigate("/main/maincommunity");
              setMenuOpen(false);
            }}
            className="mobile-link"
          >
            Community
          </Button>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okText="Yes, Logout"
        cancelText="Cancel"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </nav>
  );
};

export default MainNav;

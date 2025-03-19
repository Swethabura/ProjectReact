import React, { useEffect, useState } from "react";
import { Avatar, Button, Switch, Modal, Drawer } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  ProfileOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../Styles/MainNav.css";
import { fetchProfile } from "../redux/profileSlice";

const MainNav = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const { profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Logout Handling
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("LoggedInUser");
    setIsModalVisible(false);
    navigate("/login");
  };

  // Drawer Control for Mobile
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  return (
    <nav className="navbar">
      {/* Left: User Avatar and Title */}
      <div className="navleft">
        <Avatar
          size="large"
          src={profile?.profilePic ? profile?.profilePic : null}
          icon={!profile?.profilePic ? <UserOutlined /> : null}
          onClick={window.innerWidth <= 768 ? toggleDrawer : null}
          style={{ cursor: "pointer" }}
        />
        <h1 className="app-title">DevConnect</h1>
      </div>

      {/* Center: Navigation Links (Hidden on Mobile) */}
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
        <MenuOutlined
          className="menu-icon"
          onClick={() => setMenuOpen(!menuOpen)}
        />
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
        </div>
      )}

      {/* Mobile Drawer (For Avatar Click) */}
      <Drawer
        title="My Profile"
        placement="left"
        closable={true}
        onClose={toggleDrawer}
        open={isDrawerVisible}
      >
        <p
          onClick={() => {
            navigate("/main/my-profile");
            toggleDrawer();
          }}
        >
          <ProfileOutlined /> My Profile
        </p>
        <p
          onClick={() => {
            navigate("/main/collection");
            toggleDrawer();
          }}
        >
          <BookOutlined /> Collection
        </p>
        <p onClick={showLogoutConfirm}>
          <LogoutOutlined /> Logout
        </p>
      </Drawer>

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

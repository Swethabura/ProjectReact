import React, { useEffect, useState } from "react";
import { Drawer, Avatar, Button, Switch } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  LogoutOutlined,
  FileImageOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../../Styles/MainNav.css"; // Import your CSS file

const MainNav = () => {
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  // Effect to apply the theme to the document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  //   toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const closeDrawer = () => {
    setVisible(false);
  };

  return (
    <nav className="navbar">
      {/* Left: User Avatar */}
      <Avatar
        size="large"
        icon={<UserOutlined />}
        className="user-avatar"
        onClick={showDrawer}
      />

      {/* Center: Navigation Links */}
      <div className="nav-links">
        <Button type="link" onClick={() => navigate("/main/feed")}>
          Feed
        </Button>
        <Button type="link" onClick={() => navigate("/main/questions")}>
          Questions
        </Button>
        <Button type="link" onClick={() => navigate("/main/maincommunity")}>
          Community
        </Button>
      </div>

      {/* Right: Post Button */}
      {/* right: post button and toggle */}
      <div className="nav-right">
        <Switch
          checked={theme == "dark"}
          onChange={toggleTheme}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          style={{marginRight:"15px"}}
        />
        <Button type="primary" className="post-btn">
          Post
        </Button>
      </div>

      {/* Sidebar (Drawer) */}
      <Drawer
        title="Profile Menu"
        placement="left"
        onClose={closeDrawer}
        open={visible}
        width={250}
      >
        <p>
          <FileImageOutlined /> Change Profile Picture
        </p>
        <p>
          <EditOutlined /> Edit Profile
        </p>
        <p>
          <TrophyOutlined /> View Achievements
        </p>
        <p>
          <LogoutOutlined /> Logout
        </p>
      </Drawer>
    </nav>
  );
};

export default MainNav;

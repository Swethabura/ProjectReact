import React, { useState } from "react";
import "../../Styles/Sidebar.css"; // Make sure it's imported correctly
import { FileImageOutlined,EditOutlined,ProfileOutlined,BookOutlined,LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate()

  // Handle logout
  const showLogoutConfirm = () => {
    setIsModalVisible(true);
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("LoggedInUser"); // Remove user data from localStorage
    setIsModalVisible(false); // Close the modal
    navigate("/login"); // Redirect to login page
  };

  return (
    <>
      {/* Sidebar (Fixed on large screens, Collapsible on small screens) */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
        {/* <p style={{ cursor: "pointer" }}>
          <FileImageOutlined /> Change Profile Picture
        </p> */}
        {/* <p
          onClick={()=>{navigate("/main/edit-profile"); setIsOpen(!isOpen);}
          }
          style={{ cursor: "pointer" }}
        >
          <EditOutlined /> Edit Profile
        </p> */}
        <p
          onClick={()=>{navigate("/main/my-profile");
            setIsOpen(!isOpen);}
          }
          
          style={{ cursor: "pointer" }}
        >
          <ProfileOutlined /> My Profile
        </p>
        <p
          onClick={()=>{navigate("/main/collection");setIsOpen(!isOpen);}
        }
          style={{ cursor: "pointer" }}
        >
          <BookOutlined /> Collection
        </p>
        <p
          onClick={showLogoutConfirm}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <LogoutOutlined /> Logout
        </p>
        </div>
      </div>

      {/* Toggle Button (Only visible on small screens) */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "❮" : "❯"}
      </button>
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
    </>
  );
};

export default Sidebar;

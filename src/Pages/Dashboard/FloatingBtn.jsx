import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../../Styles/FloatingBtn.css";
import { Button, Input, message, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const FloatingButton = ({ addNewPost, addNewQuestion }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [content, setcontent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Use useMemo to avoid unnecessary re-renders
  let buttonText = "";
  let submitFunction = null;

  if (location.pathname === "/main/feed") {
    buttonText = "Create Post";
    submitFunction = addNewPost;
  } else if (location.pathname === "/main/questions") {
    buttonText = "Ask Question";
    submitFunction = addNewQuestion;
  }
  else if (location.pathname === "/main/maincommunity")
    buttonText = "Start Collaboration";
  else return null;

  // Handle file upload
  // const handleUpload = (info) => {
  //   if (info.file.status === "done" || info.file.status === "uploading") {
  //     const file = info.file.originFileObj;
  //     if (file) {
  //       setImage(URL.createObjectURL(file));
  //     }
  //   }
  // };

  const error = () => {
    messageApi.open({
      type: "error",
      content: "Post cannot be empty!",
    });
  };

  // Handle post submission
  const handlePost = () => {
    if (!content || !content.trim()) {
      error();
      return;
    }

    const loggedInUser = localStorage.getItem("LoggedInUser") || "Guest";
    // Create new post object
    const newEntry = {
      id: Date.now(),
      user: loggedInUser,
      avatar: `https://via.placeholder.com/40`, // Placeholder avatar
      content,
      image: image || "",
      likes: 0,
      comments: [],
      likedBy: [],
      answers:[],
      saved: false,
    };

    // Call the correct function (either addNewPost or addNewQuestion)
    if (submitFunction) {
      submitFunction(newEntry);
    }

    setIsModalOpen(false);
    setcontent("");
    setImage(null);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)} className="floating-button">
        {buttonText}
      </button>
      {contextHolder}
      <Modal
        title={buttonText}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handlePost}
        okText="Post"
        cancelText="Cancel"
      >
        <Input.TextArea
          name="postInput"
          rows={3}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setcontent(e.target.value)}
        />
        <Upload
          listType="picture"
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setImage(reader.result); 
            };
            return false; // Prevent default upload
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {image ? (
          <img
            src={image}
            alt="preview"
            style={{ width: "100%", marginTop: "10px" }}
            onError={(e) => (e.target.style.display = "none")} // Hide broken images
          />
        ) : null}
      </Modal>
    </>
  );
};

export default FloatingButton;

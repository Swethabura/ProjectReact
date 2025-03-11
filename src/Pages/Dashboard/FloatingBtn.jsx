import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../Styles/FloatingBtn.css";
import { Button, Input, message, Modal, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { addPost, addQuestion } from "../redux/userSlice";
import { fetchProfile } from "../redux/profileSlice";

const FloatingButton = ({ addNewPost, addNewQuestion }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(""); // Needed for questions and only used for questions
  const [content, setContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const { loading, error, profile } = useSelector((state) => state.profile);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

  const profilePic = profile?.profilePic
  

  let buttonText = "";
  let isQuestion = false;

  if (location.pathname === "/main/feed") {
    buttonText = "Create Post";
  } else if (location.pathname === "/main/questions") {
    buttonText = "Ask Question";
    isQuestion = true;
  } else {
    return null; // If not in feed or questions, don't render the button
  }

  const showError = (msg) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
  };

  const handleSubmit = async () => {
    if (isQuestion && !title.trim()) {
      showError("Title cannot be empty!");
      return;
    }
    if (!content.trim()) {
      showError(
        isQuestion ? "Question cannot be empty!" : "Post cannot be empty!"
      );
      return;
    }

    let newEntry;
    if (isQuestion) {
      newEntry = {
        user: loggedInUser,
        avatar: profilePic ? profilePic : `https://via.placeholder.com/40`, // Placeholder avatar
        title,
        content,
        image: image || "",
        answers: [],
        votes: 0,
        votedBy: [],
      };
      dispatch(addQuestion(newEntry))
        .unwrap()
        .then(() => {
          messageApi.success("Question posted successfully!");
          setIsModalOpen(false);
          setTitle("");
          setContent("");
          setImage(null);
        })
        .catch((error) => {
          messageApi.error(error || "Failed to post question.");
        });
    } else {
      newEntry = {
        user: loggedInUser,
        avatar: profilePic ? profilePic:`https://via.placeholder.com/40`, // Placeholder avatar
        content,
        image: image || "",
        likes: 0,
        likedBy: [],
        comments: [],
      };
      dispatch(addPost(newEntry))
        .unwrap()
        .then(() => {
          messageApi.success("Post added successfully!");
          setIsModalOpen(false);
          setTitle("");
          setContent("");
          setImage(null);
        })
        .catch((error) => {
          messageApi.error(error || "Failed to add post.");
        });
    }

    setIsModalOpen(false);
    setTitle("");
    setContent("");
    setImage(null);
  };
  const handleCreatePost = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <button onClick={handleCreatePost} className="floating-button">
        {buttonText}
      </button>
      {contextHolder}
      <Modal
        title={buttonText}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={isQuestion ? "Ask" : "Post"}
        cancelText="Cancel"
      >
        {isQuestion && (
          <Input
            placeholder="Enter your question title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        )}
        <Input.TextArea
          rows={3}
          placeholder={
            isQuestion ? "Describe your question..." : "What's on your mind?"
          }
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {image && (
          <img
            src={image}
            alt="preview"
            style={{ width: "100%", marginTop: "10px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </Modal>
    </>
  );
};

export default FloatingButton;

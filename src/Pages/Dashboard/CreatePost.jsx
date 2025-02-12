import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Upload } from "antd";
import { useState } from "react";
import "../../Styles/CreatePost.css";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreatePost = ({ closeModal, addPost }) => {
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState(
    JSON.parse(localStorage.getItem("posts")) || []
  );
  const navigate = useNavigate();

  const handleUpload = (info) => {
    const file = info.file; // Get the uploaded file
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result); // Convert to base64 and set state
    };

    reader.readAsDataURL(file); // Read file as Data URL
  };

  const handleSubmit = () => {
    if (!postText.trim()) {
      message.error("Post cannot be empty!!");
      return;
    }

    const loggedInUser = localStorage.getItem("LoggedInUser") || "Guest";
    const newPost = {
      id: Date.now(),
      user: loggedInUser,  // Use actual logged-in user
      avatar: `https://i.pravatar.cc/150?u=${loggedInUser}`,
      content: postText,
      image: image,
      likes: 0,
      comments: [],
      timestamp: new Date().toLocaleString().split(" ").slice(1,4).join(" ")
    };

    const updatedPosts = [newPost, ...posts]; // Add new post at the top
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setPosts(updatedPosts); // Update feed immediately 

   // Call addPost to update the parent state
  if (addPost) {
    addPost(newPost);
  } else {
    console.error("addPost is not defined!");
  }

    setPostText("");
    setImage(null);
    message.success("Post created succesfully!!");

    closeModal(); // Close modal after submission
  };

  return (
    <div className="create-post">
      <h3>Create a Post</h3>
      <TextArea
        rows={4}
        placeholder="What's in your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <Upload
        accept="image/*"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleUpload}
      >
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
      {image && <img src={image} alt="preview" className="preview-img" />}
      <Button type="primary" onClick={handleSubmit} className="submit-btn">
        Post
      </Button>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default CreatePost;

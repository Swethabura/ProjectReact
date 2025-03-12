import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPosts } from "../redux/adminSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Button, Image, message, Spin, notification } from "antd";
import { CommentOutlined, DeleteOutlined } from "@ant-design/icons";
import "./AdminDashboard.css";
import { adminDeletePost } from "../redux/adminSlice";

const PostManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.admin);
  const [expandedPosts, setExpandedPosts] = useState({});

  useEffect(() => {
    const role = localStorage.getItem("UserRole");
    if (role !== "admin") {
      navigate("/main"); // Redirect non-admin users
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchAdminPosts());
  }, [dispatch]);

  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDeletePost = async (postId) => {
      try {
        await dispatch(adminDeletePost(postId)).unwrap();
        notification.success({
          message: "Success",
          description: "Post deleted successfully!",
          placement: "topRight",
        });
    
        setTimeout(() => {
          dispatch(fetchAdminPosts());
        }, 500); // Re-fetch updated list
      } catch (error) {
        notification.error({
          message: "Error",
          description: "Failed to delete Post!",
          placement: "topRight",
        });
      }
    };

  if (loading) {
    return <Spin size="large" className="loading-spinner" />;
  }

  if (error) {
    return <p className="error-message">Error loading posts: {error}</p>;
  }

  return (
    <div className="admindashboard-container">
      {posts.length === 0 ? (
        <p className="no-data-message">No posts available.</p>
      ) : (
        posts.map((post) => (
          <Card key={post._id} className="feed-card">
            <div className="post-header">
              <Avatar src={post.avatar} />
              <span className="username">{post.user}</span>
            </div>
            <p className="post-content">{post.content}</p>
            {post.image && <Image src={post.image} alt="Post-image" className="post-image" />}
            
            <div className="post-actions">
              <Button onClick={() => toggleComments(post._id)} icon={<CommentOutlined />}>
                {post.comments.length} Comments
              </Button>
              <Button onClick={() => handleDeletePost(post._id)} icon={<DeleteOutlined />} danger>
                Delete Post
              </Button>
            </div>

            {/* Comments Section */}
            {expandedPosts[post._id] && (
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <strong>{comment.user}: </strong>{comment.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
};

export default PostManagement;

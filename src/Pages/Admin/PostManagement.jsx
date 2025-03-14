import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPosts, adminDeletePost } from "../redux/adminSlice";
import { Table, Button, Avatar, notification, Input, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const { Search } = Input; // Consistent Search Component

const PostManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [filteredPosts, setFilteredPosts] = useState([]); // Filtered list

  useEffect(() => {
    const role = localStorage.getItem("UserRole");
    if (role !== "admin") {
      navigate("/main"); // Redirect non-admin users
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchAdminPosts());
  }, [dispatch]);

   // Update filteredPosts when posts change
   useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts); // Show all posts when search is empty
      return;
    }
    const filtered = posts.filter(
      (post) =>
        post.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const handleDeletePost = async (postId) => {
    try {
      await dispatch(adminDeletePost(postId)).unwrap();
      notification.success({
        message: "Success",
        description: "Post deleted successfully!",
        placement: "topRight",
      });
      dispatch(fetchAdminPosts()); // Refresh posts
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete post!",
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

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <div className="user-info">
          <Avatar src={record.avatar} />
          <span style={{fontFamily:"'Inter', sans-serif", paddingLeft:"10px"}}>{text}</span>
        </div>
      ),
    },
    {
      title: "Post Content",
      dataIndex: "content",
      key: "content",
      ellipsis: true, // Truncate long content
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render:(date) => 
      (<>
      <span style={{color:"black",fontFamily:"'Inter', sans-serif"}}>{date.split("T")[0]}</span>
      </>)
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => handleDeletePost(record._id)}
          icon={<DeleteOutlined />}
          danger
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="admindashboard-container" style={{marginTop:"18vh"}}>
      {/* Search Input */}
      {/* Search Bar - Now Consistent with User Management */}
    <Search
      placeholder="Search by username or post content"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      enterButton
      allowClear
      style={{ width: '100%', maxWidth: '400px', marginBottom: '15px' }}
    />

      {/* Table Display */}
      <Table
        columns={columns}
        dataSource={filteredPosts} // ✅ Ensure search results are displayed
        rowKey="_id"
        pagination={{ pageSize: 5 }}
        bordered
      />
    </div>
  );
};

export default PostManagement;

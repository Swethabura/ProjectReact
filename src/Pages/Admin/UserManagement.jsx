import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, notification, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  deleteUser,
  fetchAdminPosts,
  fetchAdminQuestions,
} from "../redux/adminSlice";

const { Search } = Input; // Ant Design Search Input

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, posts, questions, loading } = useSelector(
    (state) => state.admin
  );
  const [userData, setUserData] = useState([]);
  const [searchText, setSearchText] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState([]); // State for filtered users

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAdminPosts());
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0 && posts.length > 0 && questions.length > 0) {
      const updatedUsers = users.map((user) => {
        const totalPosts = posts.filter(
          (post) => post.user === user.username
        ).length;
        const totalQuestions = questions.filter(
          (question) => question.user === user.username
        ).length;

        return {
          ...user,
          totalPosts,
          totalQuestions,
          key: user._id, // Ant Design Table requires a unique key
        };
      });

      setUserData(updatedUsers);
      setFilteredData(updatedUsers); // Initially, show all users
    }
  }, [users, posts, questions]);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);

    if (value.trim() === "") {
      setFilteredData(userData);
    } else {
      const lowercasedValue = value.toLowerCase();
      const filteredUsers = userData.filter(
        (user) =>
          user.username.toLowerCase().includes(lowercasedValue) ||
          user.email.toLowerCase().includes(lowercasedValue)
      );
      setFilteredData(filteredUsers);
    }
  };

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId))
      .unwrap()
      .then(() => {
        notification.success({
          message: "User Deleted",
          description: "The user has been successfully deleted.",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Error",
          description: error || "Failed to delete user.",
        });
      });
  };

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Total Posts", dataIndex: "totalPosts", key: "totalPosts" },
    {
      title: "Total Questions",
      dataIndex: "totalQuestions",
      key: "totalQuestions",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="user-container">
      <h1 style={{  color:"var(--primary-color)", textAlign:"center", padding:"0.5rem 0 1rem 0", fontWeight:"900"}}>All Users</h1>

      {/* Search Bar */}
      <Search
        placeholder="Search by username or email"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        enterButton
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        bordered
        pagination={{ pageSize: 10}}
      />
    </div>
  );
};

export default UserManagement;

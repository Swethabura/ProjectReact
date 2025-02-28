import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, List, Spin, Typography, Button, Modal } from "antd";
import { fetchProfile, unsavePost } from "../../redux/profileSlice";
import "./EditProfile.css"; // Use shared CSS for styling
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const apiUrl = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.profile);
  const profile = useSelector((state) => state.profile.profile);
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(fetchProfile(loggedInUser));
  // }, [dispatch]);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser)); // Only fetch if user exists
    }
  }, [dispatch, loggedInUser]);

  const handleUnsave = (postId) => {
    const accountUsername = loggedInUser;
    // console.log(accountUsername, postId)
    dispatch(unsavePost({ accountUsername, postId }));
  };
  // console.log(profile?.savedPosts)
  if (loading)
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <Paragraph type="danger">Error: {error.message}</Paragraph>
      </div>
    );

  if (!profile || Object.keys(profile).length === 0) {
    return (
      <div className="empty-profile-container">
        <img
          src="/empty-profile.png"
          alt="Empty Profile"
          className="empty-profile-img"
        />
        <Title level={4}>Your profile is not updated yet!</Title>
        <Paragraph>
          Go to the Edit Profile section and update your details.
        </Paragraph>
      </div>
    );
  }
  // console.log(`${apiUrl}/public${profile.profilePic.replace(/\\/g, "/")}`);
  // console.log(profile.profilePic)
  return (
    <div className="profile-container">
      <Card title="My Profile" className="profile-card">
        <div className="profile-header">
          <Avatar
            size={100}
            src={
              profile.profilePic
                ? `${apiUrl}/public${profile.profilePic.replace(/\\/g, "/")}`
                : profile.gender === "Male"
                ? "/default-male-avatar.png"
                : profile.gender === "Female"
                ? "/default-female-avatar.png"
                : "/default-avatar.png"
            }
            icon={!profile.profilePic && <UserOutlined />}
          />
          <div className="profile-info">
            <Title level={3}>{profile.username || "Unknown User"}</Title>
            <Paragraph className="profile-gender">
              <strong>Gender:</strong> {profile.gender || "Not specified"}
            </Paragraph>
          </div>
        </div>
        <div className="profile-details">
          <Paragraph>
            <strong>Email:</strong> {profile.email || "Not provided"}
          </Paragraph>
          <Paragraph>
            <strong>Education:</strong> {profile.education || "Not specified"}
          </Paragraph>
          <Paragraph>
            <strong>Address:</strong> {profile.address || "Not available"}
          </Paragraph>
          <Paragraph>
            <strong>Date of Birth:</strong>{" "}
            {profile.dob
              ? new Date(profile.dob).toLocaleDateString()
              : "Not set"}
          </Paragraph>
        </div>

        <Title level={4}>Saved Posts</Title>
        {profile?.savedPosts && profile?.savedPosts.length > 0 ? (
          <List
            dataSource={profile?.savedPosts}
            renderItem={(post) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={post?.avatar} />}
                  title={`Saved from @${post?.user}`}
                  description={post?.content?.substring(0, 100) + "..."} // Show a preview
                />
                <Button
                  type="link"
                  onClick={() => navigate(`/main/post/${post._id}`)}
                >
                  View Post
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleUnsave(post._id)}
                >
                  Unsave
                </Button>
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>No saved posts yet.</Paragraph>
        )}
        <Title level={4}>My Posts</Title>
        {profile?.myPosts && profile?.myPosts.length > 0 ? (
          <List
            dataSource={profile?.myPosts}
            renderItem={(post) => <List.Item>{post}</List.Item>}
          />
        ) : (
          <Paragraph>You haven’t created any posts yet.</Paragraph>
        )}
      </Card>
    </div>
  );
};

export default Profile;

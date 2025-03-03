import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Card, Spin, Typography, Button } from "antd";
import { fetchProfile } from "../../redux/profileSlice";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css"; // Use shared CSS for styling
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for profile
  const { loading, error, profile } = useSelector((state) => state.profile);
  const loggedInUser = localStorage.getItem("LoggedInUser");

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser)); // Fetch basic profile
    }
  }, [dispatch, loggedInUser]);

  // Handle loading and error states
  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!profile) {
    return <div>It looks like this profile has not been created yet.</div>;
  }

  // Handle navigate button
  const navigateBack = () => {
    navigate("/main/feed");
  };

  return (
    <Card className="profile-card">
      <Avatar size={100} icon={<UserOutlined />} />
      <Title level={3}>{profile.username || "Not specified"}</Title>
      <Paragraph>
        Gender: {profile.gender || "Not specified"}
      </Paragraph>
      <Paragraph>
        Email: {profile.email || "Not provided"}
      </Paragraph>
      <Paragraph>
        Education: {profile.education || "Not specified"}
      </Paragraph>
      <Paragraph>
        Address: {profile.address || "Not available"}
      </Paragraph>
      <Paragraph>
        Date of Birth:{" "}
        {profile.dob
          ? new Date(profile.dob).toLocaleDateString()
          : "Not set"}
      </Paragraph>

      <Button type="primary" onClick={navigateBack}>
        Back
      </Button>
    </Card>
  );
};

export default Profile;
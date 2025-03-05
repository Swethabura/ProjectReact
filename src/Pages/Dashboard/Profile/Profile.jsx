import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Card,
  Spin,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from "antd";
import { fetchProfile, updateProfile } from "../../redux/profileSlice";
import { useNavigate } from "react-router-dom";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import "./EditProfile.css";
import Resizer from "react-image-file-resizer";

const { Title, Paragraph } = Typography;
const { Option } = Select;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);

  const { loading, error, profile } = useSelector((state) => state.profile);
  const loggedInUser = localStorage.getItem("LoggedInUser");

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

  if (loading) return <Spin size="large" />;
  if (error) return <div>Error: {error.message}</div>;
  if (!profile)
    return (
      <div style={{ marginTop: "18vh", color: "blue" }}>
        It looks like this profile has not been created yet.
      </div>
    );

  // Handle Edit Button Click
  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      username: profile.username,
      gender: profile.gender,
      education: profile.education,
      address: profile.address,
      dob: profile.dob ? null : profile.dob,
      email: profile.email,
      profilePic: profile.profilePic, // Keep existing profile pic
    });
    setPreviewImage(profile.profilePic || null);
  };

  // Handle Modal Close
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Handle File Upload (Convert to Base64)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        300, // Max width
        300, // Max height
        "JPEG", // Format
        80, // Quality (0-100)
        0, // Rotation
        (uri) => {
          setPreviewImage(uri); // Show preview
          form.setFieldsValue({ profilePic: uri.split(",")[1] }); // Store Base64 (without metadata)
        },
        "base64"
      );
    }
  };
  // Handle Form Submission
  const onFinish = async (values) => {
    try {
      const formattedDob = values.dob ? values.dob.format("YYYY-MM-DD") : null;

      const profileData = {
        accountUsername: loggedInUser,
        ...values,
        dob: formattedDob,
        profilePic: previewImage || profile.profilePic, // Keep existing pic if none uploaded
      };

      await dispatch(updateProfile(profileData)).unwrap();
      message.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Card className="profile-card">
      <Avatar
        size={100}
        src={profile.profilePic ? profile.profilePic : null}
        icon={!profile.profilePic ? <UserOutlined /> : null}
      />
      <Title level={3}>{profile.username || "Not specified"}</Title>
      <Paragraph>Gender: {profile.gender || "Not specified"}</Paragraph>
      <Paragraph>Email: {profile.email || "Not provided"}</Paragraph>
      <Paragraph>Education: {profile.education || "Not specified"}</Paragraph>
      <Paragraph>Address: {profile.address || "Not available"}</Paragraph>
      <Paragraph>
        Date of Birth:{" "}
        {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not set"}
      </Paragraph>

      {/* Edit Button */}
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={showModal}
        style={{ marginRight: "10px" }}
      >
        Edit
      </Button>
      <Button onClick={() => navigate("/main/feed")}>Back</Button>

      {/* Modal for Edit Profile */}
      <Modal
        title="Edit Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Username">
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select your gender">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="education" label="Education">
            <Input placeholder="Enter your education" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter your address" />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter your email" />
          </Form.Item>

          {/* Profile Picture Upload */}
          <Form.Item name="profilePic" label="Profile Picture">
            {previewImage && (
              <img
                src={previewImage}
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  marginBottom: "10px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block" }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Profile;

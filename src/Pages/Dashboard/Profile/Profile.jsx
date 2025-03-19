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
  const isGuest = loggedInUser === "Guest";

  useEffect(() => {
    if (loggedInUser && !isGuest) {
      dispatch(fetchProfile(loggedInUser));
    }
  }, [dispatch, loggedInUser, isGuest]);

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (error) return <div>Error: {error.message}</div>;

  // Fallback for Guest Profile
  const guestProfile = {
    username: "Guest",
    gender: "Not specified",
    education: "Not specified",
    address: "Not available",
    dob: null,
    email: "Not provided",
    profilePic: null,
  };

  const displayProfile = isGuest ? guestProfile : profile;

  // Handle Edit Button Click
  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      username: displayProfile.username,
      gender: displayProfile.gender,
      education: displayProfile.education,
      address: displayProfile.address,
      dob: displayProfile.dob ? null : displayProfile.dob,
      email: displayProfile.email,
      profilePic: displayProfile.profilePic,
    });
    setPreviewImage(displayProfile.profilePic || null);
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
        300,
        300,
        "JPEG",
        80,
        0,
        (uri) => {
          setPreviewImage(uri);
          form.setFieldsValue({ profilePic: uri.split(",")[1] });
        },
        "base64"
      );
    }
  };

  // Handle Form Submission
  const onFinish = async (values) => {
    if (isGuest) {
      message.warning("Profile changes are not saved in guest mode.");
      setIsModalOpen(false);
      return;
    }

    try {
      const formattedDob = values.dob ? values.dob.format("YYYY-MM-DD") : null;

      const profileData = {
        accountUsername: loggedInUser,
        ...values,
        dob: formattedDob,
        profilePic: previewImage || profile.profilePic,
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
        src={displayProfile?.profilePic}
        icon={!displayProfile?.profilePic ? <UserOutlined /> : null}
      />
      <Title level={3}>{displayProfile.username}</Title>
      <Paragraph>Gender: {displayProfile.gender}</Paragraph>
      <Paragraph>Email: {displayProfile.email}</Paragraph>
      <Paragraph>Education: {displayProfile.education}</Paragraph>
      <Paragraph>Address: {displayProfile.address}</Paragraph>
      <Paragraph>
        Date of Birth:{" "}
        {displayProfile.dob
          ? new Date(displayProfile.dob).toLocaleDateString()
          : "Not set"}
      </Paragraph>

      {/* Edit Button */}
      <div className="editAndBackBtns">
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showModal}
          className="editProfile-btn"
        >
          Edit
        </Button>
        <Button onClick={() => navigate("/main/feed")} className="back-btn">
          Back
        </Button>
      </div>

      {/* Modal for Edit Profile */}
      <Modal
        title={
          <span style={{ fontSize: "18px", fontFamily: "'Inter', sans-serif" }}>
            Edit Profile
          </span>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        style={{ margin: "-8vh auto" }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="username" label="Username">
            <Input placeholder="Enter your username" disabled={isGuest} />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select placeholder="Select your gender" disabled={isGuest}>
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item name="education" label="Education">
            <Input placeholder="Enter your education" disabled={isGuest} />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input placeholder="Enter your address" disabled={isGuest} />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: "100%" }} disabled={isGuest} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input placeholder="Enter your email" disabled={isGuest} />
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
              style={{
                display: "block",
                fontFamily: "'Inter', sans-serif",
                background: "var(--card-bg-color)",
                border: "1px solid rgba(0,0,0,0.3)",
              }}
              disabled={isGuest}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Profile;

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Upload,
  message,
  Select,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Ensure axios is imported
import { updateProfile } from "../../redux/profileSlice"; // Ensure this action exists
import "./EditProfile.css"; // Import CSS for styling

const { Option } = Select;

const apiUrl = import.meta.env.VITE_BASE_URL;

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Handle file upload
  const handleUpload = async (info) => {
    if (info.file.status === "uploading") return; // Don't do anything while uploading

    if (info.file.status === "done") {
      const response = info.file.response;
      if (response && response.filePath) {
        form.setFieldsValue({ profilePic: response.filePath });
        message.success("Profile picture uploaded successfully!");
      } else {
        message.error("Upload failed. Please try again.");
      }
    } else if (info.file.status === "error") {
      message.error("Failed to upload profile picture.");
    }
  };

  const onFinish = async (values) => {
    try {
      const loggedInUser =localStorage.getItem("LoggedInUser");
      if (!loggedInUser) {
        message.error("User not logged in. Please log in again.");
        return;
      }

      // Convert DatePicker value to "YYYY-MM-DD" format
      const formattedDob = values.dob ? values.dob.format("YYYY-MM-DD") : null;

      // Extract only the URL from the uploaded profilePic
      const profilePicUrl =
        values.profilePic && typeof values.profilePic === "string"
          ? values.profilePic
          : values.profilePic?.file?.response?.filePath || null;

      const profileData = {
        accountUsername: loggedInUser,
        ...values,
        dob: formattedDob, // Ensure correct date format
        profilePic: profilePicUrl, // Send only the file URL, not the whole file object
      };

      await dispatch(updateProfile(profileData)).unwrap();
      message.success("Profile saved successfully!");
      navigate("/main/my-profile");
    } catch (error) {
      message.error("Failed to save profile. Please try again.");
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="edit-profile-container">
      <Card className="edit-profile-card">
        <h2 className="profile-title">Edit Profile</h2>
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
          <Form.Item name="profilePic" label="Profile Picture">
            <Upload
              name="profilePic"
              action={`${apiUrl}/public/profile-pic/upload-url`}
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("You can only upload image files!");
                  return Upload.LIST_IGNORE;
                }
                return true;
              }}
              onChange={(info) => {
                if (info.file.status === "done") {
                  const fileUrl = info.file.response.filePath; // Get the correct URL
                  form.setFieldsValue({ profilePic: fileUrl }); // Store URL instead of binary
                  message.success("Profile picture uploaded successfully!");
                } else if (info.file.status === "error") {
                  message.error("Failed to upload profile picture.");
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Picture</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="save-btn">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;

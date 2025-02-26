import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Input, DatePicker, Button, Upload, message, Select, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateProfile } from "../../redux/profileSlice"; // Ensure this action exists
import "./EditProfile.css"; // Import CSS for styling

const { Option } = Select;

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const loggedInUser = localStorage.getItem("LoggedInUser"); // Assuming user info is stored in localStorage
      if (!loggedInUser) {
        message.error("User not logged in. Please log in again.");
        return;
      }
  
      const profileData = {
        accountUsername: loggedInUser, // Ensure username is sent
        ...values,
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
              action="http://localhost:5000/api/public/profile-pic/upload-url"
              showUploadList={false}
              onChange={(info) => {
                if (info.file.status === "done") {
                  form.setFieldsValue({ profilePic: info.file.response.filePath });
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

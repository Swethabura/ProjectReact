import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Card,
  List,
  Spin,
  Typography,
  Button,
  Modal,
  message,
} from "antd";
import { fetchProfile } from "../../redux/profileSlice";
import { fetchPosts } from "../../redux/userSlice";
import "./EditProfile.css"; // Use shared CSS for styling
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  fetchUserCollection,
  unsaveAnswer,
  unsavePost,
  fetchAnswersByIds,
} from "../../redux/userCollectionSlice";

const { Title, Paragraph } = Typography;

const apiUrl = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { loading, error } = useSelector((state) => state.profile);
  const profile = useSelector((state) => state.profile.profile);
  const collection = useSelector((state) => state.userCollection);
  const {
    collectionLoading,
    collectionError,
    savedPosts,
    savedAnswers,
    myPosts,
    myAnswers, // IDs of answers created by the user
  } = collection;
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const navigate = useNavigate();

  // Redux state for posts
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.posts);

  // Local state for fetched answers
  const [fetchedAnswers, setFetchedAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [errorAnswers, setErrorAnswers] = useState(null);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser)); // Fetch basic profile
      dispatch(fetchUserCollection(loggedInUser)); // Fetch saved posts & my posts
      dispatch(fetchPosts()); // Fetch all posts
    }
  }, [dispatch, loggedInUser]);

  // Fetch answers when `myAnswers` is available
  useEffect(() => {
    if (myAnswers && myAnswers.length > 0) {
      setLoadingAnswers(true);
      setErrorAnswers(null);

      dispatch(fetchAnswersByIds(myAnswers))
        .unwrap()
        .then((answers) => {
          setFetchedAnswers(answers); // Store fetched answers in local state
        })
        .catch((err) => {
          setErrorAnswers(err); // Handle errors
        })
        .finally(() => {
          setLoadingAnswers(false); // Stop loading
        });
    } else {
      setFetchedAnswers([]); // Clear answers if no IDs are available
    }
  }, [dispatch, myAnswers]);

  // Filter myPosts
  const myFilteredPosts = posts?.filter((post) => myPosts?.includes(post._id));

  // Handle loading and error states
  if (postsLoading || loadingAnswers) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (postsError || errorAnswers) {
    return (
      <div className="error-container">
        <Paragraph type="danger">
          Error: {postsError?.message || errorAnswers?.message}
        </Paragraph>
      </div>
    );
  }

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

  if (!profile) {
    return (
      <div className="empty-profile-container">
        <img
          src="/empty-profile.png"
          alt="Empty Profile"
          className="empty-profile-img"
        />
        <Title level={4}>User does not exist.</Title>
        <Paragraph>
          It looks like this profile has not been created yet.
        </Paragraph>
      </div>
    );
  }

  // Handle navigate button
  const navigateBack = () => {
    navigate("/main/feed");
  };

  return (
    <div className="profile-container">
      <Card title="My Profile" className="profile-card">
        {contextHolder}
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

        {/* Display Saved Posts */}
        <Title level={4}>Saved Posts</Title>
        {savedPosts && savedPosts.length > 0 ? (
          <List
            dataSource={savedPosts}
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

        {/* Display Saved Answers */}
        <Title level={4}>Saved Answers</Title>
        {savedAnswers && savedAnswers.length > 0 ? (
          <List
            dataSource={savedAnswers}
            renderItem={(answer) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={answer?.avatar} />}
                  title={`Saved from @${answer?.user}`}
                  description={answer?.content?.substring(0, 100) + "..."} // Show a preview
                />
                <Button
                  type="link"
                  onClick={() => navigate(`/main/post/${answer._id}`)}
                >
                  View Answer
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleUnsaveAnswer(answer._id)}
                >
                  Unsave
                </Button>
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>No saved answers yet.</Paragraph>
        )}

        {/* Display My Posts */}
        <Title level={4}>My Posts</Title>
        {myFilteredPosts && myFilteredPosts.length > 0 ? (
          <List
            dataSource={myFilteredPosts}
            renderItem={(post) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={post.avatar} />}
                  title={`Posted by @${post.user}`}
                  description={post.content.substring(0, 100) + "..."}
                />
                <Button
                  type="link"
                  onClick={() => navigate(`/main/post/${post._id}`)}
                >
                  View Post
                </Button>
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>You haven’t created any posts yet.</Paragraph>
        )}

        {/* Display My Answers */}
        <Title level={4}>My Answers</Title>
        {fetchedAnswers && fetchedAnswers.length > 0 ? (
          <List
            dataSource={fetchedAnswers}
            renderItem={(answer) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={answer.avatar} />}
                  title={`Answered by @${answer.user}`}
                  description={answer.content.substring(0, 100) + "..."}
                />
                <Button
                  type="link"
                  onClick={() => navigate(`/main/post/${answer.questionId}`)}
                >
                  View Question
                </Button>
              </List.Item>
            )}
          />
        ) : (
          <Paragraph>You haven’t answered any questions yet.</Paragraph>
        )}

        <Button type="primary" onClick={navigateBack}>
          Back
        </Button>
      </Card>
    </div>
  );
};

export default Profile;
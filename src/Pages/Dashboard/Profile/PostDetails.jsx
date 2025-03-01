import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCollection, unsavePost, unsaveAnswer } from "../../redux/userCollectionSlice";
import { Avatar, Card, Spin, Typography, Button, message } from "antd";

const { Paragraph } = Typography;

const PostDetails = () => {
  const { postId } = useParams(); // Could be post or answer ID
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedPosts, savedAnswers, loading } = useSelector((state) => state.userCollection);
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi,contextHolder] = message.useMessage();

  const [postDetails, setPostDetails] = useState(null);
  const [isAnswer, setIsAnswer] = useState(false);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserCollection(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    const foundPost = savedPosts.find((p) => p._id === postId);
    const foundAnswer = savedAnswers.find((a) => a._id === postId);

    if (foundPost) {
      setPostDetails(foundPost);
      setIsAnswer(false);
    } else if (foundAnswer) {
      setPostDetails(foundAnswer);
      setIsAnswer(true);
    }
  }, [savedPosts, savedAnswers, postId]);

  // Unsave function for posts & answers
  const handleUnsave = () => {
    if (!postDetails) return;
  
    if (isAnswer) {
      dispatch(unsaveAnswer({ accountUsername: loggedInUser, answerId: postId }))
        .unwrap()
        .then(() => {
          messageApi.success("Answer removed from saved answers.");
          setTimeout(() => navigate("/main/my-profile"), 1500); // Small delay
        })
        .catch((error) => {
          messageApi.error(error || "Failed to remove answer.");
        });
    } else {
      dispatch(unsavePost({ accountUsername: loggedInUser, postId }))
        .unwrap()
        .then(() => {
          messageApi.success("Post removed from saved posts.");
          setTimeout(() => navigate("/main/my-profile"), 1500); // Small delay
        })
        .catch((error) => {
          messageApi.error(error || "Failed to remove post.");
        });
    }
  };  

  const handleBack = () => {
    navigate("/main/my-profile");
  };

  if (loading) return <Spin size="large" />;
  if (!postDetails) return <Paragraph>Loading post or answer...</Paragraph>;

  return (
    <Card
      title={isAnswer ? "Saved Answer" : "Saved Post"}
      style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}
    >
      {contextHolder}
      <Avatar src={postDetails.avatar || "/default-avatar.png"} size={50} />
      <Paragraph>
        <strong>@{postDetails.user || "Unknown"}</strong>
      </Paragraph>
      <Paragraph>{postDetails.content}</Paragraph>

      {postDetails.image && <img src={postDetails.image} alt="Post" style={{ maxWidth: "100%", marginTop: 10 }} />}

      <div style={{ marginTop: 20 }}>
        <Button type="primary" danger onClick={handleUnsave}>
          {isAnswer ? "Unsave Answer" : "Unsave Post"}
        </Button>
        <Button type="primary" onClick={handleBack} style={{ marginLeft: 10 }}>
          Back
        </Button>
      </div>
    </Card>
  );
};

export default PostDetails;

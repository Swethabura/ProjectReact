import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserCollection, unsavePost, unsaveAnswer, deleteMyPost, deleteMyQuestion, fetchAnswersByIds } from "../../redux/userCollectionSlice";
import { fetchPosts, deletePost, fetchQuestions, deleteQuestion } from "../../redux/userSlice";
import '@ant-design/v5-patch-for-react-19';
import { Avatar, Card, Spin, Typography, Button, message, Modal } from "antd";

const { Paragraph } = Typography;

const PostDetails = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedPosts, savedAnswers, myPosts, myAnswers, myQuestions, loading } = useSelector((state) => state.userCollection);
  const { posts:allposts, isLoading: postsLoading } = useSelector((state) => state.posts); // Get all posts from Redux store
  const { questions:allQuestions, isLoading: questionsLoading } = useSelector((state) => state.questions); // Get all posts from Redux store
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi, contextHolder] = message.useMessage();

  const [postDetails, setPostDetails] = useState(null);
  const [postType, setPostType] = useState(""); // "savedPost", "savedAnswer", "myPost", "myAnswer"

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserCollection(loggedInUser));
      dispatch(fetchPosts());
      dispatch(fetchQuestions());
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    const foundPost = savedPosts.find((p) => p._id === postId);
    const foundAnswer = savedAnswers.find((a) => a._id === postId);
    // Since myPosts only has IDs, we need to fetch the actual post from allPosts
    const foundMyPost = allposts.find((p) => myPosts.includes(p._id) && p._id === postId);
    const foundMyQuestion = allQuestions.find((q) => myQuestions.includes(q._id) && q._id === postId);

    if (myAnswers.includes(postId)) {
      setPostType("myAnswer");
      dispatch(fetchAnswersByIds([postId]))
        .unwrap()
        .then((data) => setPostDetails(data[0])) // Store the first (and only) answer
        .catch(() => messageApi.error("Failed to fetch answer details"));
        setPostType("myAnswer");
    } else {
    if (foundPost) {
      setPostDetails(foundPost);
      setPostType("savedPost");
    } else if (foundAnswer) {
      setPostDetails(foundAnswer);
      setPostType("savedAnswer");
    } else if (foundMyPost) {
      setPostDetails(foundMyPost);
      setPostType("myPost");
    } 
    else if (foundMyQuestion) {
      setPostDetails(foundMyQuestion);
      setPostType("myQuestion");
    }
  }}, [savedPosts, savedAnswers, myPosts, myAnswers, myQuestions, postId, dispatch]);
  
  // to handle unsave for the saveposts and savedanswers
  const handleUnsave = () => {
    if (!postDetails) return;

    if (postType === "savedAnswer") {
      dispatch(unsaveAnswer({ accountUsername: loggedInUser, answerId: postId }))
        .unwrap()
        .then(() => {
          messageApi.success("Answer removed from saved answers.");
          setTimeout(() => navigate("/main/collection"), 1500);
        })
        .catch((error) => {
          messageApi.error(error || "Failed to remove answer.");
        });
    } else if (postType === "savedPost") {
      dispatch(unsavePost({ accountUsername: loggedInUser, postId }))
        .unwrap()
        .then(() => {
          messageApi.success("Post removed from saved posts.");
          setTimeout(() => navigate("/main/collection"), 1500);
        })
        .catch((error) => {
          messageApi.error(error || "Failed to remove post.");
        });
    }
  };
  // handle delete button for the my-posts
  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this post?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (postType === "myQuestion") {
          dispatch(deleteQuestion(postId)); // Remove from global questions list
          dispatch(deleteMyQuestion({ questionId: postId, accountUsername: loggedInUser })); // Remove from myQuestions
          dispatch(fetchQuestions()); // Refresh questions list
          messageApi.success("Question deleted successfully.");
        } else {
          dispatch(deletePost(postId)); // Remove from global posts list
          dispatch(deleteMyPost({ postId, accountUsername: loggedInUser })); // Remove from myPosts
          dispatch(fetchPosts()); // Refresh posts list
          messageApi.success("Post deleted successfully.");
        }
        setTimeout(() => navigate("/main/collection"), 1500); // Redirect
      },
    });
  };
  
  // handle navigate for the back buttons
  const handleBack = () => {
    navigate("/main/collection");
  };

  if (loading) return <Spin size="large" />;
  if (!postDetails) return <Paragraph>Loading post or answer...</Paragraph>;

  return (
    <Card
      title={
        postType === "savedPost"
          ? "Saved Post"
          : postType === "savedAnswer"
          ? "Saved Answer"
          : postType === "myPost"
          ? "My Post"
        : postType === "myQuestion"
        ? "My Question"
        : "My Answer"
      }
      style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}
    >
      {contextHolder}
      <Avatar src={postDetails.avatar || "/default-avatar.png"} size={50} />
      <Paragraph>
        <strong>@{postDetails.user || "Unknown"}</strong>
      </Paragraph>
      {/* Show Title for Questions */}
    {postType === "myQuestion" && <Typography.Title level={4}>{postDetails.title}</Typography.Title>}
      <Paragraph>{postDetails.content}</Paragraph>

      {postDetails.image && <img src={postDetails.image} alt="Post" style={{ maxWidth: "100%", marginTop: 10 }} />}

      {/* Show Votes for Questions */}
    {postType === "myQuestion" && (
      <Paragraph>
        Votes: {postDetails.votes}
      </Paragraph>
    )}

      <div style={{ marginTop: 20 }}>
        {postType.startsWith("saved") && (
          <Button type="primary" danger onClick={handleUnsave}>
            {postType === "savedAnswer" ? "Unsave Answer" : "Unsave Post"}
          </Button>
        )}
        {postType === "myPost" || postType === "myQuestion" && (
        <>
          <Button type="primary" danger onClick={handleDelete}>
            Delete
          </Button>
        </>
      )}
        <Button type="primary" onClick={handleBack} style={{ marginLeft: 10 }}>
          Back
        </Button>
      </div>
    </Card>
  );
};

export default PostDetails;

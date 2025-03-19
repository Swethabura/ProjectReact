import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserCollection,
  unsavePost,
  unsaveAnswer,
  deleteMyPost,
  deleteMyQuestion,
  fetchAnswersByIds,
} from "../../redux/userCollectionSlice";
import {
  fetchPosts,
  deletePost,
  fetchQuestions,
  deleteQuestion,
} from "../../redux/userSlice";
import "@ant-design/v5-patch-for-react-19";
import { Avatar, Card, Spin, Typography, Button, message, Modal } from "antd";
import "../../../Styles/PostDetails.css";

const { Paragraph } = Typography;

const PostDetails = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { savedPosts, savedAnswers, myPosts, myAnswers, myQuestions, loading } =
    useSelector((state) => state.userCollection);
  const { posts: allposts, isLoading: postsLoading } = useSelector(
    (state) => state.posts
  );
  const { questions: allQuestions, isLoading: questionsLoading } = useSelector(
    (state) => state.questions
  );
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi, contextHolder] = message.useMessage();

  const [postDetails, setPostDetails] = useState(null);
  const [postType, setPostType] = useState("");

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchUserCollection(loggedInUser));
      dispatch(fetchPosts());
      dispatch(fetchQuestions());
    }
  }, [dispatch, loggedInUser]);

  useEffect(() => {
    if (loggedInUser === "Guest") {
      const guestSavedPosts =
        JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
      const guestSavedAnswers =
        JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];

      // Check for saved answers and dispatch to fetch details
      if (guestSavedAnswers.includes(postId)) {
        dispatch(fetchAnswersByIds([postId]))
          .unwrap()
          .then((data) => {
            setPostDetails(data[0]);
            setPostType("savedAnswer");
          })
          .catch(() => messageApi.error("Failed to fetch answer details"));
      }
      // Check for saved posts using allposts
      else if (guestSavedPosts.includes(postId)) {
        const foundPost = allposts.find((p) => p._id === postId);
        if (foundPost) {
          setPostDetails(foundPost);
          setPostType("savedPost");
        }
      }
    } else {
      const foundPost = savedPosts.find((p) => p._id === postId);
      const foundAnswer = savedAnswers.find((a) => a._id === postId);
      const foundMyPost = allposts.find(
        (p) => myPosts.includes(p._id) && p._id === postId
      );
      const foundMyQuestion = allQuestions.find(
        (q) => myQuestions.includes(q._id) && q._id === postId
      );

      if (foundAnswer) {
        setPostDetails(foundAnswer);
        setPostType("savedAnswer");
      } else if (myAnswers.includes(postId)) {
        setPostType("myAnswer");
        dispatch(fetchAnswersByIds([postId]))
          .unwrap()
          .then((data) => setPostDetails(data[0]))
          .catch(() => messageApi.error("Failed to fetch answer details"));
      } else if (foundPost) {
        setPostDetails(foundPost);
        setPostType("savedPost");
      } else if (foundMyPost) {
        setPostDetails(foundMyPost);
        setPostType("myPost");
      } else if (foundMyQuestion) {
        setPostDetails(foundMyQuestion);
        setPostType("myQuestion");
      }
    }
  }, [
    savedPosts,
    savedAnswers,
    myPosts,
    myAnswers,
    myQuestions,
    postId,
    allposts,
    allQuestions,
    dispatch,
    loggedInUser,
  ]);

  const handleUnsave = () => {
    if (loggedInUser === "Guest") {
      if (postType === "savedAnswer") {
        const guestSavedAnswers =
          JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];
        const updatedAnswers = guestSavedAnswers.filter((id) => id !== postId);
        localStorage.setItem(
          "guestSavedAnswers",
          JSON.stringify(updatedAnswers)
        );
        messageApi.success("Answer unsaved.");
      } else if (postType === "savedPost") {
        const guestSavedPosts =
          JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
        const updatedPosts = guestSavedPosts.filter((id) => id !== postId);
        localStorage.setItem("guestSavedPosts", JSON.stringify(updatedPosts));
        messageApi.success("Post unsaved.");
      }
    } else {
      if (postType === "savedAnswer") {
        dispatch(
          unsaveAnswer({ accountUsername: loggedInUser, answerId: postId })
        );
        messageApi.success("Answer unsaved.");
      } else if (postType === "savedPost") {
        dispatch(unsavePost({ accountUsername: loggedInUser, postId }));
        messageApi.success("Post unsaved.");
      }
    }
    setTimeout(() => navigate("/main/collection"), 1500);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure?",
      content: "This action cannot be undone.",
      onOk: () => {
        if (postType === "myQuestion") {
          dispatch(deleteQuestion(postId));
          messageApi.success("Question deleted.");
        } else {
          dispatch(deletePost(postId));
          messageApi.success("Post deleted.");
        }
        setTimeout(() => navigate("/main/collection"), 1500);
      },
    });
  };

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (!postDetails) return <Paragraph>Loading post or answer...</Paragraph>;

  return (
    <div className="post-details-container">
      {contextHolder}
      <div className="post-header">
        <Avatar
          src={postDetails.avatar || "/default-avatar.png"}
          size={50}
          className="post-avatar"
        />
        <div>
          <strong className="post-username">
            @{postDetails.user || "Unknown"}
          </strong>
        </div>
      </div>

      <Paragraph className="post-content">{postDetails.content}</Paragraph>
      {postDetails.image && (
        <img
          src={postDetails.image}
          alt="Post"
          className="post-image"
          style={{ margin: "auto 2rem" }}
        />
      )}

      <div className="post-buttons">
        {postType.startsWith("saved") && (
          <Button type="primary" danger onClick={handleUnsave}>
            <span style={{ fontSize: "18px" }}>
              {postType === "savedPost" ? "Unsave Post" : "Unsave Answer"}
            </span>
          </Button>
        )}
        {(postType === "myPost" || postType === "myQuestion") && (
          <Button type="primary" danger onClick={handleDelete}>
            <span style={{ fontSize: "18px" }}>Delete</span>
          </Button>
        )}
        <Button type="primary" onClick={() => navigate("/main/collection")}>
          <span style={{ fontSize: "18px" }}>Back</span>
        </Button>
      </div>
    </div>
  );
};

export default PostDetails;

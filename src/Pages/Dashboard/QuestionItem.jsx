import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Input,
  List,
  Modal,
  message,
  Image,
  Divider,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  StarOutlined,
  LikeFilled,
  StarFilled,
  MessageFilled,
} from "@ant-design/icons";
import {
  fetchAnswers,
  addAnswer,
  addAnswerComment,
  updateVote,
} from "../redux/answersSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAnswer,
  fetchUserCollection,
  unsaveAnswer,
} from "../redux/userCollectionSlice";
import "../../Styles/Questions.css";
import { fetchProfile } from "../redux/profileSlice";
import {
  saveAnswerAsGuest,
  unsaveAnswerAsGuest,
  isAnswerSavedByGuest,
} from "../../utils/guestUtils";

const { TextArea } = Input;

function QuestionItem({ question }) {
  const dispatch = useDispatch();
  const [savedAnswerIds, setSavedAnswerIds] = useState(new Set());
  const [answerInput, setAnswerInput] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [commentInputs, setCommentInputs] = useState({});
  const [commentExpanded, setCommentExpanded] = useState({});
  const answers = useSelector(
    (state) => state.answers.answers?.[question._id] || []
  );
  const loggedInUser = localStorage.getItem("LoggedInUser") || "Guest";
  const { savedAnswers } = useSelector((state) => state.userCollection);
  const { loading, error, profile } = useSelector((state) => state.profile);

  // console.log(savedAnswerIds)

  // State for Share Modal
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  useEffect(() => {
    if (expanded && question._id) {
      dispatch(fetchAnswers(question._id));
    }
  }, [expanded, dispatch, question._id]);

  useEffect(() => {
    if (loggedInUser === "Guest") {
      const guestSavedAnswers =
        JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];
      setSavedAnswerIds(new Set(guestSavedAnswers));
    } else {
      dispatch(fetchUserCollection(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

   useEffect(() => {
      if (loggedInUser !== "Guest") {
        const savedIds = new Set(savedAnswers.map((answer) => answer._id));
        setSavedAnswerIds(savedIds);
      }
    }, [savedAnswers, loggedInUser]);

  useEffect(() => {
    if (loggedInUser) {
      dispatch(fetchProfile(loggedInUser));
    }
  }, [dispatch, loggedInUser]);

  const profilePic = profile?.profilePic;

  // to sumbit a new answer
  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) {
      messageApi.error("Answer cannot be empty!");
      return;
    }
    const newAnswer = {
      questionId: question._id,
      user: loggedInUser,
      content: answerInput,
      avatar: profilePic ? profilePic : `https://via.placeholder.com/40`,
      image,
    };
    try {
      await dispatch(addAnswer(newAnswer)).unwrap();
      setAnswerInput("");
      setImage(null);
      setModalVisible(false);
      messageApi.success("Answer posted successfully!");
    } catch (error) {
      messageApi.error("Failed to post answer!");
    }
  };

  // to add a comment to an answer
  const handleCommentSubmit = async (answerId) => {
    if (!commentInputs[answerId]?.trim()) {
      messageApi.error("Comment cannot be empty!");
      return;
    }
    try {
      await dispatch(
        addAnswerComment({
          answerId: answerId,
          userId: loggedInUser,
          text: commentInputs[answerId],
        })
      ).unwrap();
      setCommentInputs((prev) => ({ ...prev, [answerId]: "" }));
      messageApi.success("Comment added successfully!");

      if (question._id) {
        dispatch(fetchAnswers(question._id));
      }
    } catch (error) {
      messageApi.error("Failed to add comment!");
      console.error("Error adding comment:", error);
    }
  };

  // to update the vote
  const handleVote = async (answerId, isVoted) => {
    const result = await dispatch(
      updateVote({ answerId, userId: loggedInUser })
    )
      .unwrap()
      .then(() => {
        if (isVoted) {
          messageApi.success("Vote removed successfully!");
        } else {
          messageApi.success("Voted successfully!");
        }
      })
      .catch((error) => {
        console.error("Failed to update vote:", error);
        messageApi.error("Failed to update vote");
      });
  };

  // Handle Save/Unsave Answer
  const handleToggleSave = async (answerId) => {
    if (savedAnswerIds.has(answerId)) {
      // Unsave Logic
      if (loggedInUser === "Guest") {
        unsaveAnswerAsGuest(answerId);
      } else {
        dispatch(unsaveAnswer({ accountUsername: loggedInUser, answerId }));
      }
      setSavedAnswerIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(answerId);
        return newSet;
      });
      messageApi.success("Answer unsaved successfully!");
    } else {
      // Save Logic
      if (loggedInUser === "Guest") {
        saveAnswerAsGuest(answerId);
      } else {
        try {
          await dispatch(
            saveAnswer({ answerId, accountUsername: loggedInUser })
          );
          dispatch(fetchUserCollection(loggedInUser));
        } catch (error) {
          messageApi.error(error || "Failed to save answer");
          return;
        }
      }
      setSavedAnswerIds((prev) => new Set(prev).add(answerId));
      messageApi.success("Answer saved successfully!");
    }
  };

  // Function to generate shareable link
  const getShareableLink = (questionId, answerId) => {
    const baseUrl =
      import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5173";
    return `${baseUrl}/shared-answer/${questionId}/${answerId}`;
  };

  // Handle Share Button Click
  const handleShareClick = (questionId, answerId) => {
    setSelectedQuestionId(questionId);
    setSelectedAnswerId(answerId);
    setIsShareModalVisible(true);
  };

  // Copy Link to Clipboard
  const handleCopyToClipboard = () => {
    const link = getShareableLink(selectedQuestionId, selectedAnswerId);
    navigator.clipboard.writeText(link).then(() => {
      messageApi.success("Link copied to clipboard!");
      setIsShareModalVisible(false);
    });
  };

  // Share via WhatsApp
  const handleShareViaWhatsApp = () => {
    const link = getShareableLink(selectedQuestionId, selectedAnswerId);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, "_blank");
    setIsShareModalVisible(false);
  };

  return (
    <Card
      style={{ marginBottom: 15 }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={question.avatar} />
          <span className="username">{question.user}</span>
        </div>
      }
      className="question-card"
    >
      {contextHolder}
      <h3 className="que-title">{question.title}</h3>
      <p className="que-text">{question.content}</p>
      {question.image && <Image src={question.image} alt="Question" />}

      <div className="show-hide-section">
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          style={{ fontSize: "18px" }}
        >
          Answer
        </Button>
        <Button
          type="default"
          onClick={() => setExpanded(!expanded)}
          style={{ fontSize: "18px" }}
          className="hideBtn"
        >
          {expanded ? "Hide Answers" : "See Answers"}
        </Button>
      </div>
      {expanded && (
        <>
          <Divider />
          <List
            itemLayout="horizontal"
            locale={{ emptyText: 'No Answers' }}
            dataSource={answers}
            renderItem={(answer) => {
              const isLiked = answer?.votedBy?.includes(loggedInUser);

              return (
                <List.Item
                  style={{
                    width: "100%",
                    overflow: "hidden",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={answer.avatar} />}
                      title={
                        <span
                          style={{
                            fontSize: "16px",
                            fontFamily: "'Inter', sans-serif",
                            color: "var(--primary-color)",
                            fontWeight: "450",
                          }}
                        >
                          {answer.user}
                        </span>
                      }
                      description={
                        <>
                          <p className="answer-text">{answer.content}</p>
                          {answer.image && (
                            <Image
                              src={answer.image}
                              alt="Answer"
                              style={{
                                width: "100%",
                                marginTop: 10,
                                borderRadius: 5,
                              }}
                            />
                          )}
                        </>
                      }
                    />

                    {/* Button Row */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "15px",
                        marginTop: "10px",
                        flexWrap: "wrap",
                      }}
                      className="question-actions"
                    >
                      <Button
                        className="btn-content"
                        onClick={() =>
                          handleVote(
                            answer._id,
                            answer?.votedBy?.includes(loggedInUser)
                          )
                        }
                      >
                        {isLiked ? (
                          <LikeFilled style={{ color: "blue" }} />
                        ) : (
                          <LikeOutlined />
                        )}
                        <span className="count">{answer.votes}</span>
                        <span className="btn-text">Likes</span>
                      </Button>

                      <Button
                        className="btn-content"
                        onClick={() =>
                          setCommentExpanded((prev) => ({
                            ...prev,
                            [answer._id]: !prev[answer._id],
                          }))
                        }
                      >
                        {commentExpanded[answer._id] ? (
                          <MessageFilled style={{ color: "blue" }} />
                        ) : (
                          <MessageOutlined />
                        )}
                        <span className="btn-text">
                          {commentExpanded[answer._id]
                            ? "Hide Comments"
                            : "Comments"}
                        </span>
                      </Button>

                      <Button className="btn-content">
                        <ShareAltOutlined />
                        <span
                          className="btn-text"
                          onClick={() =>
                            handleShareClick(question._id, answer._id)
                          }
                        >
                          Share
                        </span>
                      </Button>
                      {/* Save/Unsave Button */}
                      <Button
                        className="btn-content"
                        onClick={() => handleToggleSave(answer._id)}
                      >
                        {savedAnswerIds.has(answer._id) ? (
                          <StarFilled className="saved" />
                        ) : (
                          <StarOutlined />
                        )}
                        <span className="btn-text">
                          {savedAnswerIds.has(answer._id) ? "Saved" : "Save"}
                        </span>
                      </Button>
                    </div>

                    {/* Comment Section */}
                    {commentExpanded[answer._id] && (
                      <div
                        style={{
                          marginTop: "10px",
                          border: "1px solid #ddd",
                          borderRadius: "5px",
                          padding: "10px",
                        }}
                      >
                        {/* Scrollable Comments Container */}
                        <div
                          className="commentSectionContainer"
                          style={{ maxHeight: "250px", overflowY: "scroll" }}
                        >
                          <List
                            itemLayout="horizontal"
                            dataSource={answer.comments}
                            renderItem={(comment) => (
                              <List.Item style={{ alignItems: "flex-start" }}>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar src="https://via.placeholder.com/30" />
                                  }
                                  title={
                                    <span className="comment-user">
                                      {comment.user}
                                    </span>
                                  }
                                  description={
                                    <span className="comment-text">
                                      {comment.text}
                                    </span>
                                  }
                                />
                              </List.Item>
                            )}
                          />
                        </div>

                        {/* Fixed Input Box at the Bottom */}
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                          }}
                          className="comment-section"
                        >
                          <TextArea
                            value={commentInputs[answer._id] || ""}
                            onChange={(e) =>
                              setCommentInputs((prev) => ({
                                ...prev,
                                [answer._id]: e.target.value,
                              }))
                            }
                            rows={2}
                            placeholder="Write a comment..."
                            autoFocus
                            className="comment-input"
                          />
                          <Button
                            type="primary"
                            onClick={() => handleCommentSubmit(answer._id)}
                            className="comment-btn"
                          >
                            Post
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </List.Item>
              );
            }}
          />
        </>
      )}

      <Modal
        title="Write Your Answer"
        open={modalVisible}
        onOk={handleAnswerSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Post"
      >
        <TextArea
          placeholder="Type your answer..."
          value={answerInput}
          onChange={(e) => setAnswerInput(e.target.value)}
          rows={4}
        />
      </Modal>
      {/* Share Modal */}
      <Modal
        title="Share Post"
        open={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
      >
        <Button
          block
          type="primary"
          onClick={handleCopyToClipboard}
          style={{ marginBottom: "10px" }}
        >
          Copy Link to Clipboard
        </Button>
        <Button block type="default" onClick={handleShareViaWhatsApp}>
          Share via WhatsApp
        </Button>
      </Modal>
    </Card>
  );
}

export default QuestionItem;

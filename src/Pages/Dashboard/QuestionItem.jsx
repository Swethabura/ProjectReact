import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Input, List, Modal, message, Image } from "antd";
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
import { saveAnswer, fetchUserCollection } from "../redux/userCollectionSlice";
import "../../Styles/Questions.css";

const { TextArea } = Input;

function QuestionItem({ question }) {
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (expanded && question._id) {
      dispatch(fetchAnswers(question._id));
    }
  }, [expanded, dispatch, question._id]);

  useEffect(() => {
    dispatch(fetchUserCollection(loggedInUser));
  }, [dispatch, loggedInUser]);

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
      avatar: `https://via.placeholder.com/40`,
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

  // to save an answer
  const handleSaveAnswer = (answerId) => {
    const accountUsername = loggedInUser;
    dispatch(saveAnswer({ answerId, accountUsername }))
      .unwrap()
      .then((data) => {
        // console.log("Success response:", data);
        messageApi.success("Answer saved successfully!");
        dispatch(fetchUserCollection(loggedInUser));
      })
      .catch((error) => {
        console.error("Save answer error:", error);
        messageApi.error(error || "Failed to save answer");
      });
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
        >
          {expanded ? "Hide Answers" : "See Answers"}
        </Button>
      </div>

      {expanded && (
        <List
          itemLayout="horizontal"
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
                        <MessageFilled style={{color:"blue"}} />
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
                      <span className="btn-text">Share</span>
                    </Button>

                    <Button
                      className="btn-content"
                      onClick={() => handleSaveAnswer(answer._id)}
                    >
                      {savedAnswers.some((a) => a._id === answer._id) ? (
                        <StarFilled className="saved" />
                      ) : (
                        <StarOutlined />
                      )}
                      <span className="btn-text">Save</span>
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
    </Card>
  );
}

export default QuestionItem;

import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Input, List, Modal, message, Image } from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  StarOutlined,
  LikeFilled,
} from "@ant-design/icons";
import {
  fetchAnswers,
  addAnswer,
  addAnswerComment,
  updateVote,
} from "../redux/answersSlice";
import { useDispatch, useSelector } from "react-redux";

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

  useEffect(() => {
    if (expanded && question._id) {
      dispatch(fetchAnswers(question._id));
    }
  }, [expanded, dispatch, question._id]);

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
  const handleVote = async (answerId) => {
    try {
      const result = await dispatch(updateVote({ answerId, userId: loggedInUser })).unwrap();
    } catch (error) {
      console.error("Failed to update vote:", error);
    }
  };

  return (
    <Card
      style={{ marginBottom: 15 }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={question.avatar} />
          <span>{question.user}</span>
        </div>
      }
    >
      {contextHolder}
      <h3>{question.title}</h3>
      <p>{question.content}</p>
      {question.image && (
        <img
          src={question.image}
          alt="Question"
          style={{ width: "50%", marginTop: 10 }}
        />
      )}

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Answer
        </Button>
        <Button type="default" onClick={() => setExpanded(!expanded)}>
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
                style={{ width: "100%", overflow: "hidden" }}
                actions={[
                  <Button
                    type="text"
                    onClick={() => handleVote(answer._id)}
                    icon={
                      answer?.votedBy?.includes(loggedInUser) ? (
                        <LikeFilled style={{ color: "blue" }} />
                      ) : (
                        <LikeOutlined />
                      )
                    }
                  >
                    {answer.votes}
                  </Button>,
                  <Button
                    icon={<MessageOutlined />}
                    onClick={() =>
                      setCommentExpanded((prev) => ({
                        ...prev,
                        [answer._id]: !prev[answer._id],
                      }))
                    }
                  >
                    {commentExpanded[answer._id]
                      ? "Hide Comments"
                      : "View Comments"}
                  </Button>,
                  <Button icon={<ShareAltOutlined />}>Share</Button>,
                  <Button icon={<StarOutlined />}>Save</Button>,
                ]}
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
                    title={answer.user}
                    description={
                      <>
                        <p>{answer.content}</p>
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

                  {/* Comment Section */}
                  {commentExpanded[answer._id] && (
                    <div
                      style={{
                        marginTop: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        padding: "10px",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      {/* Scrollable Comments Container */}
                      <div
                        style={{
                          maxHeight: "250px",
                          overflowY: "auto",
                          marginBottom: "10px",
                        }}
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
                                title={<span>{comment.user}</span>}
                                description={<span>{comment.text}</span>}
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
                          style={{ flex: 1, textAlign: "left" }}
                        />
                        <Button
                          type="primary"
                          onClick={() => handleCommentSubmit(answer._id)}
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

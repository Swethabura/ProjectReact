import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Button,
  Input,
  List,
  Modal,
  message,
  Upload,
  Image,
} from "antd";
import {
  LikeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  StarOutlined,
  UploadOutlined,
  LikeFilled,
} from "@ant-design/icons";
import {
  fetchAnswers,
  addAnswer,
  addAnswerComment,
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
  const [currentAnswerId, setCurrentAnswerId] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const answers = useSelector(
    (state) => state.answers.answers?.[question._id] || []
  );

  const loggedInUser = localStorage.getItem("LoggedInUser") || "Guest";

  /// Fetch answers when expanded is true
  useEffect(() => {
    if (expanded && question._id) {
      dispatch(fetchAnswers(question._id));
    }
  }, [expanded, dispatch, question._id]);

  // Handle adding an answer
  const handleAnswerSubmit = async () => {
    if (!answerInput.trim()) {
      messageApi.error("Answer cannot be empty!");
      return;
    }
    const newAnswer = {
      questionId: question._id, // Ensure correct ID usage
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

  // Handle adding a comment
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) {
      messageApi.error("Comment cannot be empty!");
      return;
    }
  
    if (!currentAnswerId) {
      messageApi.error("Error: No answer selected for commenting.");
      return;
    }
  
    try {
      await dispatch(
        addAnswerComment({
          answerId: currentAnswerId,  // Use stored answerId
          userId: loggedInUser,
          text: commentInput,
        })
      ).unwrap();
  
      setCommentInput("");
      setCommentModalVisible(false);
      messageApi.success("Comment added successfully!");
    } catch (error) {
      messageApi.error("Failed to add comment!");
      console.error("Error adding comment:", error);
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
      <h3>{question.title}</h3> {/* Display title */}
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
          renderItem={(answer) => (
            <List.Item
              actions={[
                <Button
                  type="text"
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
                  onClick={() => {
                    setCurrentAnswerId(answer._id);
                    setCommentModalVisible(true);
                  }}
                >
                  Comment
                </Button>,
                <Button icon={<ShareAltOutlined />}>Share</Button>,
                <Button icon={<StarOutlined />}>Save</Button>,
              ]}
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
            </List.Item>
          )}
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
        <Upload
          listType="picture"
          showUploadList={false}
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
              setImage(reader.result);
            };
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Upload Image</Button>
        </Upload>
        {image && (
          <img
            src={image}
            alt="preview"
            style={{ width: "100%", marginTop: "10px" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </Modal>
      <Modal
        title="Add a Comment"
        open={commentModalVisible}
        onOk={handleCommentSubmit} // Call function only when clicking 'Post'
        onCancel={() => setCommentModalVisible(false)}
        okText="Post"
      >
        <TextArea
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          rows={3}
        />
      </Modal>
    </Card>
  );
}

export default QuestionItem;

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

const { TextArea } = Input;

function QuestionItem({ question, addAnswer, updateVote }) {
  const [answerInput, setAnswerInput] = useState("");
  const [image, setImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [answers, setAnswers] = useState(question.answers);

  const loggedInUser = localStorage.getItem("LoggedInUser") || "Guest";

  // Sync answers state with question.answers prop
  useEffect(() => {
    setAnswers(question.answers);
  }, [question.answers]);

  useEffect(() => {
    const storedVotes = JSON.parse(
      localStorage.getItem(`votes_${question.id}`)
    );
    if (storedVotes) {
      setAnswers(storedVotes);
    }
  }, [question.id]);

  //   handle the answer
  const handleAnswerSubmit = () => {
    const error = () => {
      messageApi.open({
        type: "error",
        content: "The answer cannot be empty!",
      });
    };

    if (answerInput.trim() === "") {
      error();
      return;
    }

    const newAnswer = {
      id: Date.now(),
      user: loggedInUser,
      avatar: "https://via.placeholder.com/40",
      content: answerInput,
      image,
      votes: 0,
      votedBy: [],
    };

    addAnswer(question.id, newAnswer);
    setAnswerInput("");
    setModalVisible(false);
  };

  //   handle the voting system
  const handleVoting = (answerId) => {
    const updatedAnswers = answers.map((answer) => {
      if (answer.id === answerId) {
        const alreadyVoted = answer.votedBy.includes(loggedInUser);
        return {
          ...answer,
          votes: alreadyVoted ? answer.votes - 1 : answer.votes + 1,
          votedBy: alreadyVoted
            ? answer.votedBy.filter((user) => user !== loggedInUser)
            : [...answer.votedBy, loggedInUser],
        };
      }
      return answer;
    });

    setAnswers(updatedAnswers);
    localStorage.setItem(
      `votes_${question.id}`,
      JSON.stringify(updatedAnswers)
    );
    updateVote(question.id, updatedAnswers);
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
        <div style={{ marginTop: 10 }}>
          {/* <TextArea
            placeholder="Write your answer..."
            value={answerInput}
            onChange={(e) => setAnswerInput(e.target.value)}
            rows={2}
          />
          <Button
            type="primary"
            onClick={handleAnswerSubmit}
            style={{ marginTop: 5 }}
          >
            Post
          </Button> */}

          <List
            itemLayout="horizontal"
            dataSource={answers}
            renderItem={(answer) => {
              const hasVoted =
                answer.votedBy && answer.votedBy.includes(loggedInUser);

              return (
                <List.Item
                  actions={[
                    <Button
                      type="text"
                      icon={
                        hasVoted ? (
                          <LikeFilled style={{ color: "blue" }} />
                        ) : (
                          <LikeOutlined />
                        )
                      }
                      onClick={() => handleVoting(answer.id)}
                    >
                      {answer.votes}
                    </Button>,
                    <Button icon={<MessageOutlined />}>Comment</Button>,
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
              );
            }}
          />
        </div>
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
    </Card>
  );
}

export default QuestionItem;

import React, { useEffect, useState } from "react";
import { Table, Button, Avatar, Modal, Spin, notification } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestions } from "../redux/userSlice";
import { fetchAnswers } from "../redux/answersSlice";
import { adminDeleteQuestion, fetchAdminQuestions } from "../redux/adminSlice";
import "./AdminDashboard.css";

notification.config({
  placement: "topRight",
  top: 50, // Moves notifications below navbar
});

const QuestionManagement = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.admin);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { answers, loading: loadingAnswers } = useSelector(
    (state) => state.answers
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminQuestions());
  }, [dispatch]);

  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach((question) => {
        dispatch(fetchAnswers(question._id)); // Fetch answers for each question
      });
    }
  }, [questions, dispatch]);

  const handleDelete = async (questionId) => {
    try {
      await dispatch(adminDeleteQuestion(questionId)).unwrap();
      notification.success({
        message: "Success",
        description: "Question deleted successfully!",
        placement: "topRight",
      });
  
      setTimeout(() => {
        dispatch(fetchAdminQuestions());
      }, 500); // Re-fetch updated list
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete question!",
        placement: "topRight",
      });
    }
  };

  const handleViewMore = async (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
    dispatch(fetchAnswers(question._id));
  };
  // console.log(answers);

  const handleCloseModal = () => {
    setSelectedQuestion(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar src={record.avatar || "https://via.placeholder.com/40"} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text, record) =>
        text.length > 100 ? (
          <>
            {text.slice(0, 100)}...
            <Button
              type="link"
              onClick={() => handleViewMore(record)}
              style={{ paddingLeft: 5 }}
            >
              View More
            </Button>
          </>
        ) : (
          text
        ),
    },
    {
      title: "Answers",
      dataIndex: "_id",
      key: "answers",
      render: (questionId) => {
        const answerList = answers[questionId] || []; // Retrieve answers using questionId
        return <span>{answerList.length}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewMore(record)}
            style={{ marginRight: 8 }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </>
      ),
    },
  ];

  return (
    <div className="admin-container" style={{marginTop:"10vh"}}>
      <h2>Question Management</h2>
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

       {/* MODAL FOR VIEWING FULL QUESTION & ANSWERS */}
       <Modal
        title="Question Details"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedQuestion && (
          <div>
            <h3>{selectedQuestion.title}</h3>
            <p>{selectedQuestion.content}</p>

            <h4>Answers:</h4>
            {loadingAnswers ? (
              <Spin />
            ) : (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #ddd",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                {(answers[selectedQuestion._id] || []).length > 0 ? (
                  answers[selectedQuestion._id].map((answer) => (
                    <div key={answer._id} style={{ marginBottom: "10px" }}>
                      <Avatar src={answer.avatar || "https://via.placeholder.com/40"} />
                      <strong style={{ marginLeft: "8px" }}>{answer.user}:</strong>
                      <p>{answer.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No answers yet.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuestionManagement;

import React, { useEffect, useState } from "react";
import { Table, Button, Avatar, Modal, Spin, notification, Input } from "antd";
import { DeleteOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchAnswers } from "../redux/answersSlice";
import { adminDeleteQuestion, fetchAdminQuestions } from "../redux/adminSlice";
import "./AdminDashboard.css";

const { Search } = Input; // Uniform Search Component

notification.config({
  placement: "topRight",
  top: 50, // Moves notifications below navbar
});

const QuestionManagement = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector((state) => state.admin);
  const { answers, loading: loadingAnswers } = useSelector(
    (state) => state.answers
  );

  const [searchTerm, setSearchTerm] = useState(""); // Search input state
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
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

  // Search Functionality: Filters questions based on username, title, or content
  useEffect(() => {
    if (!searchTerm) {
      setFilteredQuestions(questions); // Show all questions if no search
      return;
    }

    const filtered = questions.filter(
      (q) =>
        q.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredQuestions(filtered);
  }, [searchTerm, questions]);

  const handleDelete = async (questionId) => {
    try {
      await dispatch(adminDeleteQuestion(questionId)).unwrap();
      notification.success({
        message: "Success",
        description: "Question deleted successfully!",
      });

      setTimeout(() => {
        dispatch(fetchAdminQuestions());
      }, 500); // Re-fetch updated list
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to delete question!",
      });
    }
  };

  const handleViewMore = async (question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
    dispatch(fetchAnswers(question._id));
  };

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
          <span style={{fontFamily:"'Inter', sans-serif"}}>{text}</span>
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span style={{fontFamily:"'Inter', sans-serif"}}>{text}</span>,
    },
    {
      title: "Content",
      dataIndex: "content",
      key: "content",
      render: (text, record) =>
        text.length > 50 ? (
          <>
            {text.slice(0, 50)}...
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
        const answerList = answers[questionId] || [];
        return <span style={{fontFamily:"'Inter', sans-serif"}}>{answerList.length}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewMore(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="admin-container" style={{ marginTop: "18vh" }}>
      {/* <h2>Question Management</h2> */}

      {/* Search Input Field */}
      <Search
        placeholder="Search by username, title, or content"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        enterButton
        allowClear
        style={{ width: '100%', maxWidth: '400px', marginBottom: '15px' }}
      />

      <Table
        columns={columns}
        dataSource={filteredQuestions} // ✅ Uses filtered questions
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        bordered
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
                      <Avatar
                        src={answer.avatar || "https://via.placeholder.com/40"}
                      />
                      <strong style={{ marginLeft: "8px" }}>
                        {answer.user}:
                      </strong>
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

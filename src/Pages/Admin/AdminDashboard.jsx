import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchQuestions } from "../redux/adminSlice";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { posts, postLoading, postError } = useSelector((state) => state.posts);
  const { questions, questionLoading, questionError } = useSelector((state) => state.questions);

  const navigate = useNavigate();

  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi,contextHolder] = message.useMessage()

  const success = () => {
    messageApi.open({
      type: "success",
      content: `Welcome ${loggedInUser}`,
    });
  };

  useEffect(() => {
    const hasShownMessage = sessionStorage.getItem("hasShownWelcomeMessage");

    if (loggedInUser && !hasShownMessage) {
      success();
      sessionStorage.setItem("hasShownWelcomeMessage", "true"); // Set flag for this session
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("UserRole");
    if (role !== "admin") {
      navigate("/main"); // Redirect non-admin users to user dashboard
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchQuestions());
  }, [dispatch]);

  return (
    <div className="admindashboard-container">
        {contextHolder}
      <h1>Admin Dashboard</h1>
      {postLoading && <p>Loading...</p>}
      {postError && <p>Error: {error}</p>}
      <h2>Posts</h2>
      {posts.length ? (
        posts.map((post) => (
          <div key={post.id}>
            <p>{post.title}</p>
            <p>{post.content}</p>
          </div>
        ))
      ) : (
        <p>No posts found</p>
      )}
      <h2>Questions</h2>
      {questionLoading && <p>Loading...</p>}
      {questionError && <p>Error: {error}</p>}
      {questions.length ? (
        questions.map((q) => (
          <div key={q.id}>
            <p>{q.title}</p>
            <p>{q.question}</p>
          </div>
        ))
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
};

export default AdminDashboard;

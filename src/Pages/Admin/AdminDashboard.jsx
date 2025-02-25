import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminPosts, fetchAdminQuestions } from "../redux/adminSlice";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { Avatar, Card, Button, Image, Input, message, Spin } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  SaveOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { posts, questions, loading, error } = useSelector(
    (state) => state.admin
  );
  const navigate = useNavigate();
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [messageApi, contextHolder] = message.useMessage();
  const [expandedPosts, setExpandedPosts] = useState({});
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
    dispatch(fetchAdminPosts());
    dispatch(fetchAdminQuestions());
  }, [dispatch]);
  return (
    <div className="admindashboard-container">
      {contextHolder}
      {posts.map((post) => (
        <Card key={post.id} className="feed-card">
          <div className="post-header">
            <Avatar src={post.avatar} />
            <span className="username">{post.user}</span>
          </div>
          <p className="post-content">{post.content}</p>
          {post.image && (
            <Image src={post.image} alt="Post-image" className="post-image" />
          )}
          <div className="post-actions">
            <Button
              icon={
                post.likedBy.includes(loggedInUser) ? (
                  <HeartFilled style={{ color: "red" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={() => handleLike(post.id)}
            >
              {post.likes} Likes
            </Button>
            <Button onClick={()=>toggleComments(post.id)} icon={<CommentOutlined />}>{post.comments.length}</Button>
            <Button icon={<SaveOutlined />}>Save</Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </div>
          {/* Comments Section */}
          {expandedPosts[post.id] && 
            <div className="comments-section">
              <Input 
                placeholder="Write a comment..."
                value={commentInput[post.id] || ""}
                onChange={(e)=> handleCommentChange(post.id,e.target.value)}
                style={{ marginTop: "10px" }}
              />
              <Button type="primary" onClick={()=>handleAddComment(post.id)} style={{ marginTop: "5px" }}>Add Comment</Button>
              <div className="comments-list">
                {post.comments.map((comment,index)=>(
                  <div key={index} className="comment">
                    <strong>{comment.user}</strong>{comment.text}
                  </div>
                ))}
              </div>
            </div>
            }
        </Card>
      ))}
      {questions.map((question)=> (
        <div key={question.id}>
          <h4>{question.user}</h4>
          <p>{question.content}</p>
        </div>
      ))}
    </div>
  );
};
export default AdminDashboard;

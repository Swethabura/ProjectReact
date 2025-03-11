import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button, Spin } from "antd";
import { fetchPosts } from "./redux/userSlice";
import { useEffect, useState } from "react";
import "../Styles/PostDetails.css"

function SharedPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {posts, loading, error} = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  
  // Local state for initial loading spinner
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!posts.length) {
      setIsLoading(true);
      dispatch(fetchPosts()).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Find the specific post by postId
  const post = posts.find((p) => p._id === postId);

  if (isLoading) {
    return (
      <div className="spinner-container">
        <Spin size="large" className="loading-spinner"/>
      </div>
    );
  }

  if (!post) {
    return <p style={{ color: "black", textAlign: "center" }}>Post not found or removed.</p>;
  }

  return (
    <div style={{overflowY:"hidden"}}>
      <Card className="post-details-container" >
        <div className="post-header">
          <Avatar src={post.avatar} className="post-avatar"/>
          <span className="post-username">{post.user}</span>
        </div>
        <p className="post-content">{post.content}</p>
        {post.image && <img src={post.image} alt="Post"
          className="post-image"
          style={{ margin: "auto 2rem" }} />}

        <Button
          type="primary"
          onClick={() => navigate("/login")}
          style={{ marginTop: "10px", display:"flex", justifyContent:"center", alignItems:"center"}}
        >
          <span style={{fontSize:"18px"}}>Start Your Journey</span>
        </Button>
      </Card>
    </div>
  );
}

export default SharedPost;

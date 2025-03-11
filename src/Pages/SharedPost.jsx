import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button } from "antd";
import { fetchPosts } from "./redux/userSlice";
import { useEffect } from "react";

function SharedPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {posts, loading, error} = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchPosts());
    }, [dispatch]);
    
  // Filter the post from existing Redux state
  const post = posts.find((p) => p._id === postId);

  if (!post) {
    return <p style={{color:"black"}}>Post not found or removed.</p>;
  }

  return (
    <div className="shared-post-container">
      <Card className="feed-card">
        <div className="post-header">
          <Avatar src={post.avatar} />
          <span>{post.user}</span>
        </div>
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post" />}

        <Button
          type="primary"
          onClick={() => navigate("/login")}
          style={{ marginTop: "10px" }}
        >
          Start Your Journey
        </Button>
      </Card>
    </div>
  );
}

export default SharedPost;

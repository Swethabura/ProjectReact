import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../redux/userSlice"; // Import your posts action
import { Avatar, Card, Spin, Typography } from "antd";

const { Title, Paragraph } = Typography;

const PostDetails = () => {
  const { postId } = useParams(); // Get post ID from URL
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.posts); // Get posts from Redux

  useEffect(() => {
    if (posts.length === 0) {
      dispatch(fetchPosts()); // Fetch posts only if they are not already in Redux state
    }
  }, [dispatch, posts]);

  const post = posts.find((p) => p._id === postId); // Find the post by ID

  if (loading) return <Spin size="large" />;
  if (!post) return <Paragraph>Post not found.</Paragraph>;

  return (
    <Card title={`Post from @${post.user || "Unknown"}`} style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}>
      <Avatar src={post.avatar || "/default-avatar.png"} size={50} />
      <Paragraph>
        <strong>@{post.user || "Unknown"}</strong>
      </Paragraph>
      <Paragraph>{post.content}</Paragraph>
      {post.image && <img src={post.image} alt="Post" style={{ maxWidth: "100%", marginTop: 10 }} />}
    </Card>
  );
};

export default PostDetails;

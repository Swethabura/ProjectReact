import {
  CommentOutlined,
  DeleteOutlined,
  LikeOutlined,
  SaveOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { Card, Avatar, Button, List, Input } from "antd";
import { useEffect, useState } from "react";
import "../../Styles/Feed.css";

const { TextArea } = Input;

const dummyPosts = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=3",
    content:
      "Just finished building my first full-stack project! 🚀 #React #NodeJS",
    likes: 10,
    comments: [
      {
        user: "Alice",
        text: "Awesome! Can you share the link?",
        time: "2 min ago",
      },
      { user: "Bob", text: "Great job! 🔥", time: "5 min ago" },
    ],
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Struggling with Redux state management 😩. Any tips?",
    likes: 5,
    comments: [],
  },
];

function Feed({ posts, addPost }) {
  // const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const [seePost, setSeePost] = useState([])

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    if (storedPosts.length === 0) {
      setSeePost(dummyPosts);
      localStorage.setItem("posts", JSON.stringify(dummyPosts));
    } else {
      setSeePost(storedPosts);
    }
  }, []);

  // add the timestamp
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}-${now
      .toDateString()
      .split(" ")
      .slice(1, 4)
      .join(" ")}`;
  };

  // Like handler
  const handleLike = (id) => {
    // Update likes for the specific post
    const updatedPosts = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    addPost(null); // Trigger re-render in Mainpage
  };

   // Toggle comment section
   const toggleComment = (id) => {
    setVisibleComments({ ...visibleComments, [id]: !visibleComments[id] });
  };

  // Handle comment input change
  const handleCommentChange = (id, value) => {
    setCommentInputs({ ...commentInputs, [id]: value });
  };

 // Add comment handler
  const addComment = (id) => {
    if (!visibleComments[id]) return;

    const updatedPosts = posts.map((post) =>
      post.id === id
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                user: "You",
                text: commentInputs[id],
                time: getCurrentTime(),
              },
            ],
          }
        : post
    );

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setCommentInputs({ ...commentInputs, [id]: "" }); // Clear input
    addPost(null); // Trigger re-render in Mainpage
  };

  // delete comment
  const deleteComments = (postId, commentIndex) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments.filter(
                (_, index) => index !== commentIndex
              ),
            }
          : post
      )
    );
  };

  return (
    <div className="feed">
      {posts.map((post) => (
        <Card key={post.id} className="feed-card">
          <div className="post-header">
            <Avatar src={post.avatar} />
            <span className="username">{post.user}</span>
          </div>
          <p className="post-content">{post.content}</p>
          {/* Check if the post has an image and display it */}
          {post.image && (
            <img src={post.image} alt="Post" className="post-image" />
          )}
          <div className="post-actions">
            <Button
              icon={<LikeOutlined />}
              onClick={() => handleLike(post.id)}
            >
              {post.likes}Likes
            </Button>
            <Button
              icon={<CommentOutlined />}
              onClick={() => toggleComment(post.id)}
            >
              comments
            </Button>
            <Button icon={<SaveOutlined />}>Save</Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </div>
          {/* visible comment section */}
          {visibleComments[post.id] && (
            <div className="comment-section">
              <List
                dataSource={post.comments}
                renderItem={(comment, index) => (
                  <List.Item className="comment-item">
                    <div>
                      <strong>{comment.user}:</strong>
                      {comment.text}{" "}
                      <span className="comment-time">({comment.time})</span>
                    </div>
                    {comment.user === "You" && (
                      <Button
                        icon={<DeleteOutlined />}
                        size="small"
                        type="text"
                        danger
                        onClick={() => deleteComments(post.id, index)}
                      />
                    )}
                  </List.Item>
                )}
              />
              <TextArea
                rows={2}
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Write a comment..."
              />
              <Button
                type="primary"
                onClick={() => addComment(post.id)}
                style={{ marginTop: 8 }}
              >
                Add Comment
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

export default Feed;

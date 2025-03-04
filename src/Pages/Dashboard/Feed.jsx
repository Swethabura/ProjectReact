import { Avatar, Card, Button, Image, Input, message, Spin } from "antd";
import {
  CommentOutlined,
  ShareAltOutlined,
  SaveOutlined,
  SaveFilled,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import "../../Styles/Feed.css";
import { useEffect, useState } from "react";
import {
  fetchPosts,
  addPost,
  updateLike,
  addPostComment,
} from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import FloatingButton from "./FloatingBtn";
import { savePost } from "../redux/userCollectionSlice";

function Feed() {
  
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [commentInput, setCommentInput] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const {
    posts: fetchedPosts,
    loading,
    error,
  } = useSelector((state) => state.posts);
  const [posts, setPosts] = useState([]); // Store posts locally

  useEffect(() => {
    dispatch(fetchPosts()); // Fetch posts from API
  }, [dispatch]);

  useEffect(() => {
    setPosts(fetchedPosts); // Update local state when Redux state changes
  }, [fetchedPosts]);

  if (loading) return <Spin size="large" />;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Function to add new post
  const addNewPost = (newPost) => {
    setPosts([newPost, ...posts]); // Add new post to the top of the feed
    // Optimistic UI update (update state immediately)
  };

  // Handle Like Toggle
  const handleLike = (postId) => {
    // Find the post before updating the state
    const post = posts.find((p) => p._id === postId);
    if (!post) return; // Safety check

    const isLiked = post.likedBy.includes(loggedInUser); // Check if the user has already liked the post

    // Dispatch the like/unlike action
    dispatch(updateLike({ postId, userId: loggedInUser }));

    // Update local state for immediate UI response
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: isLiked ? p.likes - 1 : p.likes + 1,
              likedBy: isLiked
                ? p.likedBy.filter((user) => user !== loggedInUser)
                : [...p.likedBy, loggedInUser],
            }
          : p
      )
    );

    // Show success message
    messageApi.success(
      isLiked ? "Post unliked successfully!" : "Liked successfully!"
    );
  };

  // toggle to make visible and hide the comment section
  const toggleComments = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // comment input handler
  const handleCommentChange = (postId, value) => {
    setCommentInput((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  // to add newcomment
  const handleAddComment = (postId) => {
    const commentText = commentInput[postId]?.trim();
    if (!commentText) {
      messageApi.error("Comment cannot be empty!");
      return;
    }

    const newComment = { user: loggedInUser, text: commentText };

    // Dispatch action to update Redux and backend
    dispatch(addPostComment({ postId, comment: newComment }));
    messageApi.success("Comment added succesfully!");

    // Clear input field after submitting
    setCommentInput((prev) => ({ ...prev, [postId]: "" }));

    // Close the comment section after adding the comment
  setExpandedPosts((prev) => ({
    ...prev,
    [postId]: false, // Set to false to collapse the section
  }));
  };

  // handle the save post
  const handleSave = (postId) => {
    const accountUsername = loggedInUser;
  
    dispatch(savePost({ accountUsername, postId }))
      .unwrap()
      .then((data) => {
        // console.log("Success response:", data); 
        messageApi.success("Post saved successfully!");
      })
      .catch((error) => {
        console.error("Save post error:", error); 
        messageApi.error(error || "Failed to save post");
      });
  };


  return (
    <div className="feed-container">
      {contextHolder}
      <FloatingButton addNewPost={(post) => dispatch(addPost(post))} />
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
              onClick={() => handleLike(post._id)}
            >
              {post.likes} Likes
            </Button>
            <Button
              onClick={() => toggleComments(post._id)}
              icon={<CommentOutlined />}
            >
              {post.comments?.length} comments
            </Button>
            <Button icon={<SaveOutlined />}
              onClick={()=>handleSave(post._id)}
            >Save</Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </div>
          {/* Comments Section */}
          {expandedPosts[post._id] && (
            <div className="comments-section">
              <Input
                placeholder="Write a comment..."
                value={commentInput[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                style={{ marginTop: "10px" }}
              />
              <Button
                type="primary"
                onClick={() => handleAddComment(post._id)}
                style={{ marginTop: "5px" }}
              >
                Add Comment
              </Button>
              <div className="comments-list">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong>{comment.user}</strong> {comment.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
export default Feed; 
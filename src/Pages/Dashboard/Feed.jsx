import { Avatar, Card, Button, Image, Input, message, Spin, Modal } from "antd";
import {
  ShareAltOutlined,
  SaveOutlined,
  SaveFilled,
  HeartFilled,
  HeartOutlined,
  MessageFilled,
  MessageOutlined,
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
import { savePost, fetchUserCollection } from "../redux/userCollectionSlice";
import { useSearchParams } from "react-router-dom";

function Feed() {
  const loggedInUser = localStorage.getItem("LoggedInUser");
  const [commentInput, setCommentInput] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const { savedPosts } = useSelector((state) => state.userCollection);
  const {
    posts: fetchedPosts,
    loading,
    error,
  } = useSelector((state) => state.posts);
  const [posts, setPosts] = useState([]); // Store posts locally

   // State for Share Modal
   const [isShareModalVisible, setIsShareModalVisible] = useState(false);
   const [selectedPostId, setSelectedPostId] = useState(null); 

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    setPosts(fetchedPosts); // Update local state when Redux state changes
  }, [fetchedPosts]);

  useEffect(() => {
    dispatch(fetchUserCollection(loggedInUser));
  }, [dispatch, loggedInUser]);

  if (loading) return <Spin size="large" className="loading-spinner" />;
  if (error) return <p className="error-message">Error: {error}</p>;

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
        dispatch(fetchUserCollection(loggedInUser));
      })
      .catch((error) => {
        console.error("Save post error:", error);
        messageApi.error(error || "Failed to save post");
      });
  };

  // Function to generate shareable link
  const getShareableLink = (postId) => {
    const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:5174";
    return `${baseUrl}/sharedpost/${postId}`;
  };

  // Handle Share Button Click
  const handleShareClick = (postId) => {
    setSelectedPostId(postId);
    setIsShareModalVisible(true);
  };

  // Copy Link to Clipboard
  const handleCopyToClipboard = () => {
    const link = getShareableLink(selectedPostId);
    navigator.clipboard.writeText(link).then(() => {
      messageApi.success("Link copied to clipboard!");
      setIsShareModalVisible(false);
    });
  };

  // Share via WhatsApp
  const handleShareViaWhatsApp = () => {
    const link = getShareableLink(selectedPostId);
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(link)}`;
    window.open(whatsappUrl, "_blank");
    setIsShareModalVisible(false);
  };



  return (
    <div className="feed-container">
      {contextHolder}
      <FloatingButton addNewPost={(post) => dispatch(addPost(post))} />
      {posts.map((post) => (
        <Card key={post._id} className="feed-card">
          <div className="post-header">
            <Avatar src={post.avatar} className="post-avatar" />
            <span className="username">{post.user}</span>
          </div>
          <p className="post-content">{post.content}</p>
          {post.image && (
            <Image src={post.image} alt="Post" className="post-image" />
          )}
          <div className="post-actions">
            <Button
              className="btn-content"
              onClick={() => handleLike(post._id)}
            >
              {post.likedBy.includes(loggedInUser) ? (
                <HeartFilled className="liked" />
              ) : (
                <HeartOutlined />
              )}
              <span className="count">{post.likes}</span>
              <span className="btn-text">Likes</span> {/* Separate text */}
            </Button>

            <Button
              className="btn-content"
              onClick={() => toggleComments(post._id)}
            >
              {expandedPosts[post._id] ? (
                <MessageFilled style={{color:"blue"}}/>
              ) : (
                <MessageOutlined />
              )}
              <span className="count">{post.comments?.length}</span>
              <span className="btn-text">Comments</span>
            </Button>

            <Button
              className="btn-content"
              onClick={() => handleSave(post._id)}
            >
              {savedPosts.some((p) => p._id === post._id) ? (
                <SaveFilled className="saved" />
              ) : (
                <SaveOutlined />
              )}
              <span className="btn-text">Save</span>
            </Button>

            <Button className="btn-content" onClick={() => handleShareClick(post._id)}>
              <ShareAltOutlined />
              <span className="btn-text">Share</span> 
            </Button>
          </div>
          {expandedPosts[post._id] && (
            <div className="comments-section">
              <Input
                placeholder="Write a comment..."
                value={commentInput[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                style={{ fontSize: "16px" }}
              />
              <Button
                type="primary"
                onClick={() => handleAddComment(post._id)}
                style={{ fontSize: "16px" }}
              >
                Add
              </Button>
              <div className="comments-list">
                {post.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <strong className="comment-user">{comment.user}:</strong>
                    <span className="comment-text"> {comment.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
      {/* Share Modal */}
      <Modal
        title="Share Post"
        open={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
      >
        <Button
          block
          type="primary"
          onClick={handleCopyToClipboard}
          style={{ marginBottom: "10px" }}
        >
          Copy Link to Clipboard
        </Button>
        <Button block type="default" onClick={handleShareViaWhatsApp}>
          Share via WhatsApp
        </Button>
      </Modal>
    </div>
  );
}
export default Feed;

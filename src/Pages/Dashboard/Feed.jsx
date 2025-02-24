import { Avatar, Card, Button, Image, Input, message, Spin } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  SaveOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import "../../Styles/Feed.css";
import { useEffect, useState } from "react";
import { fetchPosts,addPost } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import FloatingButton from "./FloatingBtn";

function Feed() {
  const loggedInUser =
  localStorage.getItem("LoggedInUser") || "Guest";
  const [commentInput, setCommentInput] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [messageApi, contextHolder] = message.useMessage()
  const dispatch = useDispatch();
  const {posts:fetchedPosts, loading, error} = useSelector((state)=> state.posts);
  const [posts, setPosts] = useState([]);  // Store posts locally
  
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
  };

  // Handle Like Toggle
  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const alreadyLiked = post.likedBy.includes(loggedInUser);
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          likedBy: alreadyLiked
            ? post.likedBy.filter((user) => user !== loggedInUser)
            : [...post.likedBy, loggedInUser],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // toggle to make visible and hide the comment section
  const toggleComments = (postUser)=>{
    setExpandedPosts((prev)=>({ ...prev,
      [postUser] : !prev[postUser]
    }));
  };

  // comment input handler
  const handleCommentChange = (postId,value)=>{
    setCommentInput((prev)=> ({
      ...prev, [postId] : value
    }));
  };
  
  const showError = () =>{
    messageApi.open({
      type: 'error',
      content: 'Comment cannot be empty!',
    });
  }

  // to add newcomment
  const handleAddComment = (postId)=>{
     const commentText = commentInput[postId]?.trim();
     if(!commentText){
      showError();
      return;
     }
     
     const updatedPosts = posts.map((post)=>{
       if(post.id === postId){
         return {
          ...post, comments: [...post.comments, {user: loggedInUser, text: commentText}]
         }
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setCommentInput((prev) => ({ ...prev, [postId]: "" })); // Clear input
  };

  return (
    <div className="feed-container">
      {contextHolder}
      <FloatingButton addNewPost={(post) => dispatch(addPost(post))} />; 
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
            <Button onClick={()=>toggleComments(post.user)} icon={<CommentOutlined />}>{post.comments.length}</Button>
            <Button icon={<SaveOutlined />}>Save</Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </div>
          {/* Comments Section */}
          {expandedPosts[post.user] && 
            <div className="comments-section">
              <Input 
                placeholder="Write a comment..."
                value={commentInput[post.user] || ""}
                onChange={(e)=> handleCommentChange(post.user,e.target.value)}
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
    </div>
  );
}
export default Feed;

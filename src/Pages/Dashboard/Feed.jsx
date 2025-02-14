import { Avatar, Card, Button, Image, Input, message } from "antd";
import {
  LikeOutlined,
  CommentOutlined,
  ShareAltOutlined,
  SaveOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import "../../Styles/Feed.css";
import { useState } from "react";

function Feed({ posts, updatePosts }) {
  const loggedInUser =
  localStorage.getItem("LoggedInUser") || "Guest";
  const [commentInput, setCommentInput] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [messageApi, contextHolder] = message.useMessage()

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
    updatePosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  // toggle to make visible and hide the comment section
  const toggleComments = (postId)=>{
    setExpandedPosts((prev)=>({ ...prev,
      [postId] : !prev[postId]
    }));
  };

  // comment input handler
  const handleCommentChange = (postId,value)=>{
    setCommentInput((prev)=> ({
      ...prev, [postId] : value
    }));
  };
  
  const error = () =>{
    messageApi.open({
      type: 'error',
      content: 'Comment cannot be empty!',
    });
  }

  // to add newcomment
  const handleAddComment = (postId)=>{
     const commentText = commentInput[postId]?.trim();
     if(!commentText){
      error();
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
    updatePosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setCommentInput((prev)=> ({...prev, [postId]: ""})); // Clear input after adding
  };

  return (
    <div className="feed-container">
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
            <Button type="text" onClick={()=>toggleComments(post.id)} icon={<CommentOutlined />}>{post.comments.length}</Button>
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
    </div>
  );
}
export default Feed;

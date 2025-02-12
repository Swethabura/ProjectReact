import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "../../Styles/MainPage.css";
import MainNav from "./MainNav";
import Feed from "./Feed";
import Questions from "./Questions";
import MainCommunity from "./MainCommunity";

function Mainpage() {
  // const [user, setUser] = useState("");
  // const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(storedPosts);
  }, []);

   // Function to add a new post
   const addPost = (newPost) => {
    setPosts((prevPosts) => {
      const updatedPosts = [newPost, ...prevPosts]; // Add new post at the top
      localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Save to localStorage
      return updatedPosts; // Update state
    });
  };
  

  // useEffect(() => {
  //   const LoggedInUser = localStorage.getItem("LoggedInUser");
  //   if (!LoggedInUser) {
  //     navigate("/login");
  //   } else {
  //     setUser(LoggedInUser);
  //   }
  // }, [navigate]);
  return (
    <div className="main-container">
        <MainNav addPost={addPost}/>
      <Routes>
        <Route path="/" element={<Navigate to='feed' replace/>}/>  {/*for default routing*/}
        <Route path="feed" element={<Feed posts={posts} addPost={addPost}/>}/>
        <Route path="questions" element={<Questions />}/>
        <Route path="mainCommunity" element={<MainCommunity />}/>
      </Routes>
      {/* <h1>Welcome {user} !!</h1>
      <p>This is your new World into the DevConnect...</p>
      <button
        onClick={() => {
          localStorage.removeItem("LoggedInUser");
          navigate("/login");
        }}
      >
        Logout
      </button> */}
    </div>
  );
}

export default Mainpage;

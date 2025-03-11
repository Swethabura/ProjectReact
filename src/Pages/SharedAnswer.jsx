import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAnswers } from "./redux/answersSlice";
import { Card, Avatar, Button, Spin } from "antd";
import "../Styles/PostDetails.css"

function SharedAnswer() {
  const { questionId, answerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const answers = useSelector((state) => state.answers.answers?.[questionId] || []);
//   const loading = useSelector((state) => state.answers.loading);

  // Local state to track initial loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!answers.length) {
      setIsLoading(true); // Set loading true only when fetching new data
      dispatch(fetchAnswers(questionId)).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false); // If data is already available, set loading to false
    }
  }, [dispatch, questionId]);

  // Find the specific answer by answerId
  const answer = answers.find((a) => a._id === answerId);

  if (isLoading) return <Spin size="large" className="loading-spinner" />;
  if (!answer) return <p style={{ color: "black" }}>Answer not found or removed.</p>;

  return (
    <div style={{overflowY:"hidden"}}>
      <Card className="post-details-container">
        <div className="post-header">
          <Avatar src={answer.avatar} className="post-avatar"/>
          <span className="post-username">{answer.user}</span>
        </div>
        <p className="post-content">{answer.content}</p>

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

export default SharedAnswer;

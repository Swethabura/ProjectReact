import { useEffect, useState } from "react";
import { Typography,Spin } from "antd";
import "../../Styles/Questions.css";
import QuestionItem from "./QuestionItem";
import { fetchQuestions,addQuestion } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import FloatingButton from "./FloatingBtn";

const { Title } = Typography;

function Questions() {
  const {questions, loading, error} = useSelector((state)=> state.questions);
  const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(fetchQuestions());
    },[dispatch])

  if (loading) return <Spin size="large" className="loading-spinner"/>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>

   // Function to add new Question
   const addNewQuestion = (newQuestion) => {
    setPosts([newQuestion, ...questions]); // Add new post to the top of the feed
  };

  return (
    <div className="questions">
      {questions.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        questions.map((q) => <QuestionItem key={q.id} question={q} />)
      )}
      <FloatingButton addNewQuestion={(question) => dispatch(addQuestion(question))}/>
    </div>
  );
}

export default Questions;

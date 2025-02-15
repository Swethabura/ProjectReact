import { useEffect, useState } from "react";
// import FloatingButton from "./FloatingBtn";
// import { Avatar, Button, Card, message } from "antd";
import { Typography } from "antd";
import "../../Styles/Questions.css";
import QuestionItem from "./QuestionItem";

const { Title } = Typography;

function Questions({ questions, setQuestions}) {
  const [questionList, setQuestionList] = useState(()=>{
    const savedQuestions = JSON.parse(localStorage.getItem("questions"));
    return savedQuestions || questions
  });
  
  useEffect(() => {
    setQuestionList((prevQuestions) => {
      return questions.map((newQ) => {
        const existingQ = prevQuestions.find((q) => q.id === newQ.id);
        return existingQ ? existingQ : newQ;  // Keep existing answers if the question exists
      });
    });
  }, [questions]);

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questionList));
  }, [questionList]);
  
  // Adding the new answer
  const addAnswer = (questionId, newAnswer) => {
    setQuestionList((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? { ...q, answers: [newAnswer, ...q.answers] }
          : q
      )
    );
  };

  // update the vote
  const updateVote = (questionId, updatedAnswers) => {
    console.log("Before updating vote - updatedAnswers:", updatedAnswers);
  
    setQuestionList((prevQuestions) => {
      const updatedQuestions = prevQuestions.map((q) =>
        q.id === questionId ? { ...q, answers: updatedAnswers } : q
      );
  
      console.log("Updated Questions:", updatedQuestions);
  
      setQuestions(updatedQuestions);  
      localStorage.setItem("questions", JSON.stringify(updatedQuestions)); 
  
      return updatedQuestions;
    });
  };

  return (
    <div className="questions">
      <Title level={2}>Questions</Title>
      
      {questionList.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        questionList.map((q) => (
          <QuestionItem key={q.id} question={q} addAnswer={addAnswer} updateVote={updateVote}/>
        ))
      )}
    </div>
  );
}

export default Questions;

import { useEffect, useState } from "react";
import FloatingButton from "./FloatingBtn";
import { Card, message } from "antd";
import "../../Styles/Questions.css";

function Questions({ questions }) {
//   const [questions, setQuestions] = useState([]);
//   const [messageApi, contextHolder] = message.useMessage();

//   // Load questions from localStorage on mount
//   useEffect(() => {
//     const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
//     setQuestions(savedQuestions);
//   }, []);

//   const sucessMsg = () => {
//     messageApi.open({
//       type: "success",
//       content: "Question Posted Successfully!!",
//     });
//   };

  // Function to add a new question
//     const addNewQuestion = (newQuestion) => {
//     const updatedQuestions = [newQuestion, ...questions];
//     setQuestions(updatedQuestions);
//     localStorage.setItem("questions", JSON.stringify(updatedQuestions));
//     sucessMsg();
//   };
  return (
    <div className="questions" style={{ maxWidth: "600px", margin: "auto" }}>
        {/* {contextHolder} */}
      <h2>Questions</h2>
      {/* Floating Button to create new question */}
      {/* <FloatingButton addNewQuestion={addNewQuestion} /> */}
      {/* Display questions */}
      {questions?.length > 0 ? (
        questions.map((q) => (
          <Card key={q.id} style={{ marginBottom: "10px" }}>
            <p>
              <strong>{q.user}</strong>
            </p>
            <p>{q.content}</p>
            {q.image && (
              <img src={q.image} alt="Question" style={{ width: "100%" }} />
            )}
          </Card>
        ))
      ) : (
        <p>No questions yet. Be the first to ask!</p>
      )}
    </div>
  );
}
export default Questions;

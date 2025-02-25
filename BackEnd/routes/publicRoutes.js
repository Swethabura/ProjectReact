const express = require("express");
const { createPost,getAllPosts, likePost, addPostComment } = require("../controllers/postController.js");
const { getAllQuestions, createQuestion } = require("../controllers/questionController.js");
const {addAnswer, getAnswersByQuestionId, addAnswerComment} = require("../controllers/answerController.js")

const router = express.Router();

// Publicly accessible routes
router.get("/posts", getAllPosts);
router.post("/posts", createPost)
router.get("/questions", getAllQuestions);
router.post("/questions", createQuestion);
router.get("/:questionId", getAnswersByQuestionId);
router.post("/answers", addAnswer);
router.put("/like/:postId", likePost);
router.post("/post/:postId/comments", addPostComment);
router.post("/answers/:answerId/comments",addAnswerComment);

module.exports = router;
import { message } from "antd";

// Save Post as Guest
export const savePostAsGuest = (postId) => {
  const savedGuestPosts = JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
  
  if (!savedGuestPosts.includes(postId)) {
    savedGuestPosts.push(postId);
    localStorage.setItem("guestSavedPosts", JSON.stringify(savedGuestPosts));
    message.success("Post saved successfully!");
  } else {
    message.warning("Post already saved!");
  }
};

// Unsave Post as Guest
export const unsavePostAsGuest = (postId) => {
  const savedGuestPosts = JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
  
  if (savedGuestPosts.includes(postId)) {
    const updatedPosts = savedGuestPosts.filter((id) => id !== postId);
    localStorage.setItem("guestSavedPosts", JSON.stringify(updatedPosts));
    message.success("Post unsaved successfully!");
  } else {
    message.warning("Post is not saved!");
  }
};

// Check if Post is Saved for Guests
export const isPostSavedByGuest = (postId) => {
  const savedGuestPosts = JSON.parse(localStorage.getItem("guestSavedPosts")) || [];
  return savedGuestPosts.includes(postId);
};

// Save answer as Guest
export const saveAnswerAsGuest = (answerId) => {
  const savedGuestAnswers = JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];
  
  if (!savedGuestAnswers.includes(answerId)) {
    savedGuestAnswers.push(answerId);
    localStorage.setItem("guestSavedAnswers", JSON.stringify(savedGuestAnswers));
    message.success("Answer saved successfully!");
  } else {
    message.warning("Answer already saved!");
  }
};

// Unsave answer as Guest
export const unsaveAnswerAsGuest = (answerId) => {
  const savedGuestAnswers = JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];
  
  if (savedGuestAnswers.includes(answerId)) {
    const updatedPosts = savedGuestAnswers.filter((id) => id !== answerId);
    localStorage.setItem("guestSavedAnswers", JSON.stringify(updatedPosts));
    message.success("Answer unsaved successfully!");
  } else {
    message.warning("Answer is not saved!");
  }
};

// Check if answer is Saved for Guests
export const isAnswerSavedByGuest = (answerId) => {
  const savedGuestAnswers = JSON.parse(localStorage.getItem("guestSavedAnswers")) || [];
  return savedGuestAnswers.includes(answerId);
};
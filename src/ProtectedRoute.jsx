import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const loggedInUser = localStorage.getItem("LoggedInUser");

  if (!loggedInUser) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children;
};

export default ProtectedRoute;

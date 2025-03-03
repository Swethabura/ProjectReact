import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import HomePage from "./Pages/Home/Home";
import FeaturesPage from "./Pages/Home/Features";
import CommunityPage from "./Pages/Home/Community";
import ContactPage from "./Pages/Home/Contact";
import LoginPage from "./Pages/Auth/Login";
import SignupPage from "./Pages/Auth/Signup";
import Mainpage from "./Pages/Dashboard/MainPage";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

// Layout component with Navbar
function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <Routes>
      {/* Routes with Navbar */}
      <Route
        path="/"
        element={
          <Layout>
            <>
              <HomePage />
              <FeaturesPage />
              <CommunityPage />
              <ContactPage />
            </>
          </Layout>
        }
      />
      {/* Routes without Navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/main/*"
        element={
          <ProtectedRoute>
            <Mainpage />
          </ProtectedRoute>
        }
      />{" "}
      {/* Nested Routes */}
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

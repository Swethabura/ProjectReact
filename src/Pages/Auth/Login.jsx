import { useState, useRef } from "react";
import "../../Styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { message,Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const usernameRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_BASE_URL;
  // console.log(apiUrl);

  const errorMsg = (ref, field1, field2) => {
    messageApi.open({
      type: "error",
      content: "Invalid credentials!",
    });
    if (ref && ref.current) {
      ref.current.focus(); // Focus on the specific input with error
    }
    // Highlight the field with red border
    setError({ [field1]: true, [field2]: true });

    // remove the red boredr after 2 seconds
    setTimeout(() => {
      setError({ [field1]: false, [field2]: false });
    }, 2000);
  };

  // guest login handle
  const guestHandleLogin = (e) => {
    const username = "Guest";
    const password = "guestLogin123#";

    const guestUsers = JSON.parse(localStorage.getItem("guestUsers")) || [];
    guestUsers.push({ username, password });
    localStorage.setItem("guestUsers", JSON.stringify(guestUsers));

    localStorage.setItem("LoggedInUser", username);
    navigate("/main"); //navigate to main page/dashboard
  };

  // login handle
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setLoading(false);
        errorMsg(data.message);
        return;
      }

      // Save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("LoggedInUser", username);
      localStorage.setItem("UserRole", data.user.role); // Save role in localStorage
      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin/posts"); // Redirect admin to admin dashboard
      } else {
        navigate("/main"); // Redirect normal user to main dashboard
      }
    } catch (error) {
      setLoading(false);
      errorMsg("Something went wrong. Please try again!");
    }
  };
  return (
    <div className="mainContainer">
      <div className="auth-container">
        <h2>Login</h2>
        {/* error has to appear if any */}
        {contextHolder}
        {/* the form details */}
        <form onSubmit={handleLogin}>
          <div className="floating-label">
            <input
              type="text"
              placeholder=""
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={error.username ? "error-border" : ""}
              required
            />
            <label>Enter Username</label>
          </div>
          <div className="floating-label">
            <input
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error.password ? "error-border" : ""}
              required
            />
            <label>Enter Password</label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? (
              <>
                <LoadingOutlined style={{ marginRight: "5px" }} />
                &nbsp; Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
        {/* ✅ Guest Login */}
        <button
          style={{ marginTop: "1rem" }}
          onClick={guestHandleLogin}
          disabled={loading}
        >
          Login as Guest
        </button>
        <p>
          New User?{" "}
          <Link to="/signup" className="signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

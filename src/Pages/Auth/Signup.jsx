import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import "../../Styles/Auth.css";
import { message } from "antd";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Registered Successfully!! Redirecting to login...",
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find((u) => u.username === username)) {
      setError("Username Already exists!!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (otp !== generatedOtp) {
      setError("OTP doesn't match!");
      return;
    }
    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    success();
    setTimeout(() => {
      navigate("/login"); // Delay navigation to allow message to appear
    }, 1500);
  };

  useEffect(() => {
    generateOtp();
  }, []);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
    setGeneratedOtp(newOtp);
  };

  return (
    <div className="auth-container">
      <h2>Sign-Up</h2>
      {contextHolder}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        {/* Username Input */}
        <div className="floating-label">
          <input
            type="text"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Enter Username</label>
        </div>

        {/* Email Input */}
        <div className="floating-label">
          <input
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Enter Email</label>
        </div>

        {/* Password Input */}
        <div className="floating-label">
          <input
            type="password"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>Enter Password</label>
        </div>

        {/* Confirm Password Input */}
        <div className="floating-label">
          <input
            type="password"
            placeholder=" "
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label>Confirm Password</label>
        </div>

        {/* OTP Input */}
        <div className="otp-box">{generatedOtp}</div>
        <div className="floating-label">
          <input
            type="text"
            placeholder=" "
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label>Enter OTP</label>
        </div>

        <button onClick={generateOtp}>Regenerate OTP</button>
        <button type="submit" >Sign Up</button>
      </form>
      <p>
        Already registered?{"  --  "}
        <RouterLink to="/login" className="login">
          Login
        </RouterLink>
      </p>
    </div>
  );
}

export default SignupPage;
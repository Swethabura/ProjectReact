import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import "../../Styles/Auth.css";
import { message } from "antd";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [error, setError] = useState({}); // Store errors for specific fields

  const apiUrl = import.meta.env.VITE_BASE_URL;

  // Refs for input focus on error
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const otpRef = useRef(null);

  // error message
  const showError = (msg, ref, fieldName) => {
    messageApi.open({
      type: "error",
      content: msg,
    });
    if (ref && ref.current) {
      ref.current.focus(); // Focus on the specific input with error
    }
    // Highlight the field with red border
    setError((prev) => ({ ...prev, [fieldName]: true }));

    // Remove the red border after 2 seconds
    setTimeout(() => {
      setError((prev) => ({ ...prev, [fieldName]: false }));
    }, 2000);
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Registered Successfully!! Redirecting to login...",
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("Passwords do not match!", passwordRef, "confirmPassword");
      return;
    }
    if (otp !== generatedOtp) {
      showError("OTP doesn't match!", otpRef, "otp");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();
      if (!response.ok) {
        showError(data.msg, usernameRef, "username");
        return;
      }

      success();
      setTimeout(() => {
        navigate("/login"); // Delay navigation to allow message to appear
      }, 1500);
    } catch (error) {
      showError("Something went wrong! Try again after sometime!", null, "");
    }
  };

  useEffect(() => {
    generateOtp();
  }, []);

  const generateOtp = () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
    setGeneratedOtp(newOtp);
  };

  return (
    <div className="main-container">
      <div className="auth-container">
        <h2>Sign-Up</h2>
        {contextHolder}
        <form onSubmit={handleSignup}>
          {/* Username Input */}
          <div className="floating-label">
            <input
              type="text"
              placeholder=" "
              ref={usernameRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={error.username ? "error-border" : ""}
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
              ref={passwordRef}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={error.confirmPassword ? "error-border" : ""}
              required
            />
            <label>Confirm Password</label>
          </div>

          {/* OTP Input */}
          <div style={{display:"flex", gap:"1rem"}}>
          <div className="floating-label">
            <input
              type="text"
              placeholder=" "
              ref={otpRef}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={error.otp ? "error-border" : ""}
              required
            />
            <label>Enter Captcha</label>
          </div>
          <div className="otp-box">{generatedOtp}</div>
          </div>
          <button onClick={generateOtp}>Regenerate OTP</button>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already registered?{"  --  "}
          <RouterLink to="/login" className="login">
            Login
          </RouterLink>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

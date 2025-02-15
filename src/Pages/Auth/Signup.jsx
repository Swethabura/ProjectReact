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
  const [otp,setOtp] = useState("")
  const [generatedOtp, setGenratedOtp] = useState("");
  const navigate = useNavigate();
  const [messageApi,contextHolder] = message.useMessage();

  const success = ()=>{
     messageApi.open({
      type:'success',
      content:'Registered Succesfully!! Redirecting to login...'
     })
  }

  const handleSignup = (e) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if(users.find((u)=> u.username === username)){
        setError("Username Already exist!!");
        return;
    }
    if(password !== confirmPassword){
        setError("Passwords do not match!");
        return;
    }
    if(otp !== generatedOtp){
        setError("Otp doesn't match!");
        return;
    }

    users.push({username,email,password});
    localStorage.setItem("users",JSON.stringify(users));
    success();
    setTimeout(() => {
      navigate("/login"); // Delay navigation to allow message to appear
    }, 1500);
  };
//   generate otp when component loads
useEffect(()=>{
    generateOtp();
},[]);

  const generateOtp = ()=>{
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
    setGenratedOtp(newOtp);
  }
  return (
    <div className="auth-container">
      <h2>Sign-Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          />
          {contextHolder}
        <input
          type="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="otp-box">{generatedOtp}</div>
        <input
          type="text"
          placeholder="enter otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button onClick={generateOtp}>Regenerate OTP</button> {/* Allows OTP regeneration */}
        <button type="submit">Sign Up</button>
        
      </form>
      <p>
        Already registered? <RouterLink to="/login" className="log-in">Login</RouterLink>
      </p>
    </div>
  );
}
export default SignupPage;

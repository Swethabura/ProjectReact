import { useState,useRef } from "react";
import "../../Styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import logo from '../../assets/devconnect1.png';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [messageApi,contextHolder] = message.useMessage()
  const navigate = useNavigate();
  const usernameRef = useRef(null);

  const errorMsg = (ref,field1,field2)=>{
    messageApi.open({
      type:"error",
      content:"Invalid credentials!"
    });
    if(ref && ref.current){
      ref.current.focus()   // Focus on the specific input with error
    }
    // Highlight the field with red border
    setError({[field1]: true, [field2]: true});

    // remove the red boredr after 2 seconds
    setTimeout(()=>{
      setError({[field1]:false,[field2]:false});
    },2000)
  };

  const handleLogin = (e)=>{
     e.preventDefault()

     const users = JSON.parse(localStorage.getItem("users")) || []
     const user = users.find((u) => u.username === username && u.password === password);

     if(user){
        localStorage.setItem("LoggedInUser", username);
        navigate("/main")   //navigate to main page/dashboard
     }else{
      errorMsg(usernameRef,"username","password")
     }
  }
  return (
    <div className="main-container">
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
        <button type="submit" >Login</button>
      </form>
      <p>
        New User? <Link to="/signup" className="signup">Sign Up</Link>
      </p>
    </div>
    </div>
  );
}

export default LoginPage;   
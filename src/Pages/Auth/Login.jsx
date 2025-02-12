import { useState } from "react";
import "../../Styles/Auth.css";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e)=>{
     e.preventDefault()

     const users = JSON.parse(localStorage.getItem("users")) || []
     const user = users.find((u) => u.username === username && u.password === password);

     if(user){
        localStorage.setItem("LoggedInUser", username);
        navigate("/main")   //navigate to main page
     }else{
        setError("Invalid username or password!")
     }
  }
  return (
    <div className="auth-container">
      <h2>Login</h2>
      {/* error has to appear if any */}
      {error && <p className="error">{error}</p>}
      {/* the form details */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New User? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;

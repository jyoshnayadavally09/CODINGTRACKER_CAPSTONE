import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import "./Auth.css";

function Login() {
const navigate = useNavigate();
const [identifier, setIdentifier] = useState(""); // username or email
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const handleLogin = async (e) => {
e.preventDefault();


if (!identifier || !password) {
  setMessage("Please enter both username/email and password");
  return;
}

try {
  console.log("📤 Sending login request...");
  const res = await api.post("/login", { identifier, password });

  // Save token to localStorage for authentication
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("username", res.data.username);

  setMessage("✅ Login successful!");
  console.log("✅ Login response:", res.data);

  // Redirect to dashboard or home
  setTimeout(() => navigate("/dashboard"), 1000);
} catch (err) {
  console.error("❌ Login error:", err);
  setMessage(err.response?.data?.message || "Login failed. Check your credentials.");
}


};

return (
  <div className="auth-container">
    <div className="auth-box">
      <img
  src="14.png"
  alt="Code Hustle"
  style={{
    width: "200px",          // 🔹 increase the size
    height: "auto",          // keeps aspect ratio
    display: "block",
    margin: "0 auto 20px",   // centers and adds spacing
  }}

      />
      <h2>Welcome Back</h2>
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>

    {message && <p className="msg">{message}</p>}

    <p className="switch-text">
      Don’t have an account? <Link to="/register">Sign Up</Link>
    </p>
  </div>
</div>


);
}

export default Login;
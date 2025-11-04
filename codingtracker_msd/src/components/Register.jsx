import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";
import "./Auth.css";

function Register() {
const navigate = useNavigate();
const [form, setForm] = useState({ email: "", username: "", password: "" });
const [message, setMessage] = useState("");

// Handle input field changes
const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

// Validate the registration form
const validateForm = () => {
const { email, username, password } = form;


// Email validation (must start with letter, then valid email format)
const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
if (!emailRegex.test(email)) {
  return "Enter a valid email (should not start with symbols)";
}

// Username validation (4–15 chars, letters/numbers/underscores)
const userRegex = /^[A-Za-z0-9_]{4,15}$/;
if (!userRegex.test(username)) {
  return "Username should be 4–15 chars (letters, numbers, underscores only)";
}

// ✅ Fixed Password validation regex
const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&]).{8,}$/;
if (!passRegex.test(password)) {
  return "Password must have 1 uppercase, 1 number, 1 special char, and min 8 chars";
}

return "";


};

// Handle register form submission
const handleRegister = async (e) => {
e.preventDefault();


const validationMsg = validateForm();
if (validationMsg) {
  setMessage(validationMsg);
  return;
}

try {
  console.log("📤 Sending registration request:", form);
  const res = await api.post("/register", form);

  setMessage(res.data.message || "Registered successfully!");
  console.log("✅ Registration success:", res.data);

  // Redirect after short delay
  setTimeout(() => navigate("/login"), 1200);
} catch (err) {
  console.error("❌ Registration error:", err);
  setMessage(err.response?.data?.message || "Registration failed. Try again.");
}


};

return ( <div className="auth-container"> <div className="auth-box">
   <img
  src="14.png"
  alt="Code Hustle"
  style={{
    width: "200px",          // 🔹 increase the size
    height: "auto",          // keeps aspect ratio
    display: "block",
    margin: "0 auto 20px",   // centers and adds spacing
  }}/> <h2>Create Your Account</h2>


    <form onSubmit={handleRegister}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>

    {message && <p className="msg">{message}</p>}

    <p className="switch-text">
      Already have an account? <Link to="/login">Login</Link>
    </p>
  </div>
</div>


);
}

export default Register;
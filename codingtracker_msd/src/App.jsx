import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import LeetCode from "./components/LeetCode";
import Codeforces from "./components/Codeforces";
import Codechef from "./components/CodeChef";
import Hackerrank from "./components/HackerRank";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import ProfileChange from "./components/ProfileChange";
import DailyActivity from "./components/HabitTracker";
import AddPlatform from "./components/AddPlatform";
import CustomPlatform from "./components/CustomPlatform";
import { PlatformStatsProvider } from "./components/PlatformStatsContext";
import AskAI from "./components/AskAI";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("platformStats");
    setToken(null);
  };

  const ProtectedRoute = ({ element }) =>
    token ? element : <Navigate to="/login" replace />;

  return (
    <PlatformStatsProvider>
      <Router>
        <Routes>
          {/* ✅ Default route shows Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          {/* Protected pages (need login) */}
          <Route path="/leetcode" element={<ProtectedRoute element={<LeetCode />} />} />
          <Route path="/codeforces" element={<ProtectedRoute element={<Codeforces />} />} />
          <Route path="/codechef" element={<ProtectedRoute element={<Codechef />} />} />
          <Route path="/hackerrank" element={<ProtectedRoute element={<Hackerrank />} />} />
          <Route path="/daily-activity" element={<ProtectedRoute element={<DailyActivity />} />} />
          <Route path="/add-platform" element={<ProtectedRoute element={<AddPlatform />} />} />
          <Route path="/custom/:platform" element={<ProtectedRoute element={<CustomPlatform />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile token={token} onLogout={handleLogout} />} />} />
          <Route path="/profilechange" element={<ProtectedRoute element={<ProfileChange />} />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/ask-ai" element={<AskAI />} />
        </Routes>
      </Router>
    </PlatformStatsProvider>
  );
}

export default App;

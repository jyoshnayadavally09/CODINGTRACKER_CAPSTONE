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
import ProfileChange from "./components/ProfileChange"; // ✅ import the new profile page
import DailyActivity from "./components/HabitTracker";
import { PlatformStatsProvider } from "./components/PlatformStatsContext";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("platformStats");
    setToken(null);
  };

  return (
    <PlatformStatsProvider>
      <Router>
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
          />

          {/* Auth routes */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/leetcode"
            element={token ? <LeetCode /> : <Navigate to="/login" />}
          />
          <Route
            path="/codeforces"
            element={token ? <Codeforces /> : <Navigate to="/login" />}
          />
          <Route
            path="/codechef"
            element={token ? <Codechef /> : <Navigate to="/login" />}
          />
          <Route
            path="/hackerrank"
            element={token ? <Hackerrank /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={
              token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />
            }
          />

          {/* ✅ New route for the Profile Change page */}
          <Route
            path="/profilechange"
            element={token ? <ProfileChange /> : <Navigate to="/login" />}
          />

          {/* Daily Activity Page */}
          <Route
            path="/daily-activity"
            element={token ? <DailyActivity /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </PlatformStatsProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Codeforces.css";

export default function Codeforces() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchBackendStats = async () => {
    try {
      const res = await fetch("http://localhost:3030/codeforces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user stats.");
      const data = await res.json();

      setUsername(data.username || "");
      setStats({
        easySolved: data.easySolved || 0,
        mediumSolved: data.mediumSolved || 0,
        hardSolved: data.hardSolved || 0,
        totalSolved:
          (data.easySolved || 0) +
          (data.mediumSolved || 0) +
          (data.hardSolved || 0),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) return alert("Please enter your username.");
    setLoading(true);
    try {
      const updatedStats = {
        username,
        easySolved: stats.easySolved,
        mediumSolved: stats.mediumSolved,
        hardSolved: stats.hardSolved,
        totalSolved:
          stats.easySolved + stats.mediumSolved + stats.hardSolved,
      };

      const saveRes = await fetch("http://localhost:3030/codeforces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedStats),
      });

      if (!saveRes.ok) {
        alert("❌ Failed to save stats.");
      } else {
        alert("✅ Stats saved successfully!");
        fetchBackendStats();
      }
    } catch (err) {
      console.error("Error saving stats:", err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchBackendStats();
  }, [navigate]);

  const handleStatChange = (field, value) => {
    const updated = { ...stats, [field]: Number(value) || 0 };
    updated.totalSolved =
      updated.easySolved + updated.mediumSolved + updated.hardSolved;
    setStats(updated);
  };

  // Continuous arcs (Easy → Medium → Hard)
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const total = stats.totalSolved || 1;

  const easyArc = (stats.easySolved / total) * circumference;
  const mediumArc = (stats.mediumSolved / total) * circumference;
  const hardArc = (stats.hardSolved / total) * circumference;

  return (
    <div className="codeforces-container">
      <div className="codeforces-header">
        <h1>Codeforces Progress</h1>
        <div className="codeforces-top-bar">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Username Input */}
      <div className="username-section">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Codeforces Username"
        />
        <button className="codeforces-button" onClick={handleSubmit}>
          {loading ? "Saving..." : "Save Stats"}
        </button>
      </div>

      {/* Difficulty Labels */}
      <div className="difficulty-labels">
        <div className="label easy">Easy</div>
        <div className="label medium">Medium</div>
        <div className="label hard">Hard</div>
      </div>

      {/* Progress Circle */}
      <div className="circle-wrapper">
        <div className="progress-circle">
          <svg viewBox="0 0 240 240" className="progress-ring">
            <circle className="progress-bg" cx="120" cy="120" r="100" />
            <circle
              className="progress-segment easy"
              cx="120"
              cy="120"
              r="100"
              style={{
                strokeDasharray: `${easyArc} ${circumference - easyArc}`,
                strokeDashoffset: 0,
              }}
            />
            <circle
              className="progress-segment medium"
              cx="120"
              cy="120"
              r="100"
              style={{
                strokeDasharray: `${mediumArc} ${circumference - mediumArc}`,
                strokeDashoffset: -easyArc,
              }}
            />
            <circle
              className="progress-segment hard"
              cx="120"
              cy="120"
              r="100"
              style={{
                strokeDasharray: `${hardArc} ${circumference - hardArc}`,
                strokeDashoffset: -(easyArc + mediumArc),
              }}
            />
          </svg>

          <div className="progress-center">
            <h2>{stats.totalSolved}</h2>
            <p>Total Solved</p>
          </div>
        </div>
      </div>

      {/* Input Stats */}
      <div className="codeforces-stats">
        <p className="enter-title">Enter Your Solved Problems</p>

        <div className="stat-card easy">
          <label>Easy</label>
          <input
            type="number"
            value={stats.easySolved}
            onChange={(e) => handleStatChange("easySolved", e.target.value)}
          />
        </div>

        <div className="stat-card medium">
          <label>Medium</label>
          <input
            type="number"
            value={stats.mediumSolved}
            onChange={(e) => handleStatChange("mediumSolved", e.target.value)}
          />
        </div>

        <div className="stat-card hard">
          <label>Hard</label>
          <input
            type="number"
            value={stats.hardSolved}
            onChange={(e) => handleStatChange("hardSolved", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

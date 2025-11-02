import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // ✅ shared axios config
import "./Codeforces.css";

export default function CodeChef() {
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

  // ✅ Fetch stats from backend
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchStats = async () => {
      try {
        const res = await api.get("/codechef", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ fixed
        });
        const data = res.data;
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
        console.log("Error fetching CodeChef stats", err.message);
      }
    };

    fetchStats();
  }, [navigate, token]);

  // ✅ Save stats to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return alert("Please enter username");
    setLoading(true);
    try {
      await api.post(
        "/codechef",
        {
          username,
          easySolved: stats.easySolved,
          mediumSolved: stats.mediumSolved,
          hardSolved: stats.hardSolved,
        },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ fixed
      );
      alert("✅ Stats saved successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to save stats.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle stat input change
  const handleStatChange = (field, value) => {
    const updated = { ...stats, [field]: Number(value) || 0 };
    updated.totalSolved =
      updated.easySolved + updated.mediumSolved + updated.hardSolved;
    setStats(updated);
  };

  // ✅ Circle math
  const total = stats.totalSolved || 1;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const easyArc = (stats.easySolved / total) * circumference;
  const mediumArc = (stats.mediumSolved / total) * circumference;
  const hardArc = (stats.hardSolved / total) * circumference;

  return (
    <div className="codeforces-container green-theme">
      <div className="codeforces-header">
        <h1>CodeChef Progress</h1>
        <div className="codeforces-top-bar">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Username */}
      <div className="username-section">
        <input
          type="text"
          value={username}
          placeholder="Enter CodeChef Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="codeforces-button" onClick={handleSubmit}>
          {loading ? "Saving..." : "Save Stats"}
        </button>
      </div>

      {/* Difficulty labels */}
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
                strokeDasharray: `${easyArc} ${circumference - easyArc}`, // ✅ fixed
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
                strokeDasharray: `${hardArc} ${circumference - hardArc}`, // ✅ fixed
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

      {/* Stat Inputs */}
      <div className="codeforces-stats">
        <p className="enter-title">Enter</p>

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

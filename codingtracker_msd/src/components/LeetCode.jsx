import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api"; // ✅ use shared axios instance
import "./LeetCode.css";

export default function LeetCode() {
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

  // ✅ Fetch saved stats from backend
  const fetchBackendStats = async () => {
    try {
      const res = await api.get("/leetcode", {
        headers: { Authorization: `Bearer ${token}` },
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
      console.error("❌ Error fetching backend stats:", err.message);
    }
  };

  // ✅ Fetch stats from public LeetCode API and save to backend
  const fetchLeetCodeData = async (uname) => {
    if (!uname) return alert("Enter username");
    setLoading(true);
    try {
      const res = await fetch(
        `https://leetcode-api-faisalshohag.vercel.app/${uname}`
      );
      const data = await res.json();

      const easySolved = Number(data.easySolved || 0);
      const mediumSolved = Number(data.mediumSolved || 0);
      const hardSolved = Number(data.hardSolved || 0);
      const totalSolved = easySolved + mediumSolved + hardSolved;

      setStats({ easySolved, mediumSolved, hardSolved, totalSolved });

      // ✅ Save to backend
      await api.post(
        "/leetcode",
        { username: uname, easySolved, mediumSolved, hardSolved },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("leetUsername", uname);
    } catch (err) {
      console.error("❌ Error fetching LeetCode data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetUsername = () => {
    const uname = prompt("Enter your LeetCode username:", username || "");
    if (uname) {
      setUsername(uname);
      fetchLeetCodeData(uname);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("leetUsername");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    fetchBackendStats();
  }, [navigate]);

  // ✅ Circle stats
  const total = stats.totalSolved || 1;
  const easyPercent = (stats.easySolved / total) * 100;
  const mediumPercent = (stats.mediumSolved / total) * 100;
  const hardPercent = (stats.hardSolved / total) * 100;

  return (
    <div className="leetcode-container">
      <div className="leetcode-header">
        <h1>LeetCode Progress</h1>
        <div className="leetcode-top-bar">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="username-section">
        <strong>{username || "Not set"}</strong>
        <button className="leetcode-button" onClick={handleSetUsername}>
          {username ? "Change Username" : "Set Username"}
        </button>
      </div>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="circle-wrapper">
          <div className="progress-circle">
            <svg width="200" height="200" viewBox="0 0 120 120">
              <circle className="progress-bg" cx="60" cy="60" r="54" />
              <circle
                className="progress-segment easy"
                cx="60"
                cy="60"
                r="54"
                strokeDasharray={`${easyPercent * 3.4}, 340`}
              />
              <circle
                className="progress-segment medium"
                cx="60"
                cy="60"
                r="54"
                strokeDasharray={`${mediumPercent * 3.4}, 340`}
                strokeDashoffset={-easyPercent * 3.4}
              />
              <circle
                className="progress-segment hard"
                cx="60"
                cy="60"
                r="54"
                strokeDasharray={`${hardPercent * 3.4}, 340`}
                strokeDashoffset={-(easyPercent + mediumPercent) * 3.4}
              />
            </svg>
            <div className="progress-center">
              <h2>{stats.totalSolved}</h2>
              <p>Total Solved</p>
            </div>
          </div>

          <div className="legend">
            <span className="easy">● Easy: {stats.easySolved}</span>
            <span className="medium">● Medium: {stats.mediumSolved}</span>
            <span className="hard">● Hard: {stats.hardSolved}</span>
          </div>
        </div>
      )}

      <div className="leetcode-footer">
        <button
          className="leetcode-button"
          onClick={() => fetchLeetCodeData(username)}
        >
          Refresh Stats
        </button>
      </div>
    </div>
  );
}

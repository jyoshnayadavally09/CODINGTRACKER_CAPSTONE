// Codeforces.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Codeforces() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [easy, setEasy] = useState(0);
  const [medium, setMedium] = useState(0);
  const [hard, setHard] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // Helper to calculate stroke offset for progress circles
  const calculateOffset = (value, total = 100) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(value / total, 1);
    return circumference - percent * circumference;
  };

  return (
    <div className="leetcode-container purple-theme" style={{ position: "relative" }}>
      {/* Top Back Button */}
      <div className="leetcode-top-bar">
        <button className="back-button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      <div className="leetcode-header">
        <h1>Codeforces Tracker</h1>
      </div>

      {!submitted ? (
        <form className="leetcode-stats-section" onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your Codeforces username"
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #BB86FC",
                background: "#2D2A3F",
                color: "#E0E0E0"
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Easy Problems Solved:</label>
            <input
              type="number"
              min="0"
              value={easy}
              onChange={(e) => setEasy(parseInt(e.target.value))}
              required
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #BB86FC",
                background: "#2D2A3F",
                color: "#E0E0E0",
                width: "80px"
              }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label>Medium Problems Solved:</label>
            <input
              type="number"
              min="0"
              value={medium}
              onChange={(e) => setMedium(parseInt(e.target.value))}
              required
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #BB86FC",
                background: "#2D2A3F",
                color: "#E0E0E0",
                width: "80px"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Hard Problems Solved:</label>
            <input
              type="number"
              min="0"
              value={hard}
              onChange={(e) => setHard(parseInt(e.target.value))}
              required
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                borderRadius: "5px",
                border: "1px solid #BB86FC",
                background: "#2D2A3F",
                color: "#E0E0E0",
                width: "80px"
              }}
            />
          </div>

          <button
            type="submit"
            className="leetcode-button"
            style={{ display: "block", marginTop: "10px" }}
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="leetcode-stats-section">
          <h2>User: {username}</h2>

          <div className="progress-circles-container">
            {/* Easy Circle */}
            <div className="progress-circle-item">
              <svg className="progress-circle-svg" width="120" height="120">
                <circle
                  className="progress-circle-bg"
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className="progress-circle-progress easy-progress"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={calculateOffset(easy, 100)}
                />
                <text
                  className="progress-text-solved"
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {easy}
                </text>
                <text
                  className="progress-text-label"
                  x="60"
                  y="85"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Easy
                </text>
              </svg>
            </div>

            {/* Medium Circle */}
            <div className="progress-circle-item">
              <svg className="progress-circle-svg" width="120" height="120">
                <circle
                  className="progress-circle-bg"
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className="progress-circle-progress medium-progress"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={calculateOffset(medium, 100)}
                />
                <text
                  className="progress-text-solved"
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {medium}
                </text>
                <text
                  className="progress-text-label"
                  x="60"
                  y="85"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Medium
                </text>
              </svg>
            </div>

            {/* Hard Circle */}
            <div className="progress-circle-item">
              <svg className="progress-circle-svg" width="120" height="120">
                <circle
                  className="progress-circle-bg"
                  cx="60"
                  cy="60"
                  r="50"
                />
                <circle
                  className="progress-circle-progress hard-progress"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={calculateOffset(hard, 100)}
                />
                <text
                  className="progress-text-solved"
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {hard}
                </text>
                <text
                  className="progress-text-label"
                  x="60"
                  y="85"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Hard
                </text>
              </svg>
            </div>
          </div>

          <button
            className="leetcode-button"
            onClick={() => setSubmitted(false)}
            style={{ marginTop: "15px" }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

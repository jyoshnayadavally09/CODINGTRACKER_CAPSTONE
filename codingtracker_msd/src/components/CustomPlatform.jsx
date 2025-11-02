import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Codeforces.css";

export default function CustomPlatform() {
  const { platform } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    username: "",
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0,
  });

  // 🔹 Fetch the platform data
  const fetchPlatformData = async () => {
    try {
      const res = await fetch("http://localhost:3030/custom-platforms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch platforms");
      const data = await res.json();

      const match = data.find(
        (p) => p.platform.toLowerCase() === platform.toLowerCase()
      );

      if (match) {
        setFormData({
          username: match.username || "",
          easySolved: match.easySolved || 0,
          mediumSolved: match.mediumSolved || 0,
          hardSolved: match.hardSolved || 0,
          totalSolved:
            (match.easySolved || 0) +
            (match.mediumSolved || 0) +
            (match.hardSolved || 0),
        });
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/login");
    fetchPlatformData();
  }, [platform]);

  // 🔹 Handle input change
  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: Number(value) || 0 };
    updated.totalSolved =
      updated.easySolved + updated.mediumSolved + updated.hardSolved;
    setFormData(updated);
  };

  // 🔹 Save or update platform data
  const handleSubmit = async () => {
    if (!formData.username.trim()) return alert("Enter username");

    try {
      const res = await fetch("http://localhost:3030/custom-platforms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform: platform, // ✅ Important to send platform name
          username: formData.username,
          easySolved: formData.easySolved,
          mediumSolved: formData.mediumSolved,
          hardSolved: formData.hardSolved,
          totalSolved: formData.totalSolved,
          imageUrl: "",
        }),
      });

      if (!res.ok) throw new Error("Failed to save platform data");

      alert("✅ Data saved successfully!");
      navigate("/", { state: { refresh: true } });
    } catch (err) {
      console.error("❌ Save error:", err);
      alert("❌ Failed to save data");
    }
  };

  return (
    <div className="codeforces-container">
      <div className="codeforces-header">
        <h1>{platform.toUpperCase()} Progress</h1>
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
      </div>

      <div className="username-section">
        <input
          type="text"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          placeholder={`Enter ${platform} username`}
        />
        <button onClick={handleSubmit} className="codeforces-button">
          Save Stats
        </button>
      </div>

      <div className="difficulty-labels">
        <div className="label easy">Easy</div>
        <div className="label medium">Medium</div>
        <div className="label hard">Hard</div>
      </div>

      <div className="circle-wrapper">
        <div className="progress-circle">
          <svg viewBox="0 0 240 240" className="progress-ring">
            <circle className="progress-bg" cx="120" cy="120" r="100" />
          </svg>
          <div className="progress-center">
            <h2>{formData.totalSolved}</h2>
            <p>Total Solved</p>
          </div>
        </div>
      </div>

      <div className="codeforces-stats">
        <p className="enter-title">Enter Your Solved Problems</p>

        <div className="stat-card easy">
          <label>Easy</label>
          <input
            type="number"
            value={formData.easySolved}
            onChange={(e) => handleChange("easySolved", e.target.value)}
          />
        </div>

        <div className="stat-card medium">
          <label>Medium</label>
          <input
            type="number"
            value={formData.mediumSolved}
            onChange={(e) => handleChange("mediumSolved", e.target.value)}
          />
        </div>

        <div className="stat-card hard">
          <label>Hard</label>
          <input
            type="number"
            value={formData.hardSolved}
            onChange={(e) => handleChange("hardSolved", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

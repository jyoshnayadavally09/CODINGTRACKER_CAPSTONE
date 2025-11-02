import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Codeforces.css";

export default function DynamicPlatform() {
  const { name } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    totalSolved: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`http://localhost:3030/platform/${name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data) {
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
      }
    };
    fetchStats();
  }, [name]);

  const handleSave = async () => {
    const res = await fetch(`http://localhost:3030/platform/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stats),
    });
    if (res.ok) alert("✅ Stats saved!");
  };

  const handleChange = (key, val) => {
    const updated = { ...stats, [key]: Number(val) || 0 };
    updated.totalSolved =
      updated.easySolved + updated.mediumSolved + updated.hardSolved;
    setStats(updated);
  };

  return (
    <div className="codeforces-container">
      <div className="codeforces-header">
        <h1>{name} Progress</h1>
        <button onClick={() => navigate("/custom-platforms")}>← Back</button>
      </div>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder={`Enter ${name} Username`}
      />
      <button onClick={handleSave}>Save</button>

      <div className="stats">
        <label>Easy</label>
        <input
          type="number"
          value={stats.easySolved}
          onChange={(e) => handleChange("easySolved", e.target.value)}
        />
        <label>Medium</label>
        <input
          type="number"
          value={stats.mediumSolved}
          onChange={(e) => handleChange("mediumSolved", e.target.value)}
        />
        <label>Hard</label>
        <input
          type="number"
          value={stats.hardSolved}
          onChange={(e) => handleChange("hardSolved", e.target.value)}
        />
        <p>Total: {stats.totalSolved}</p>
      </div>
    </div>
  );
}

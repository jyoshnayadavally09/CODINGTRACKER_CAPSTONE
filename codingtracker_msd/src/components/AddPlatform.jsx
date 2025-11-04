import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ap.css";

const AddPlatform = () => {
  const [platform, setPlatform] = useState("");
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Login required");
      return navigate("/login");
    }

    try {
      const res = await fetch(
        "https://codingtracker-capstone-8.onrender.com/custom-platforms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ fixed this line
          },
          body: JSON.stringify({
            platform,
            username,
            imageUrl,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save platform");

      await res.json();
      navigate("/");
    } catch (err) {
      setError("Error saving platform");
      console.error(err);
    }
  };

  return (
    <div className="add-platform-wrapper">
      <div className="add-platform-card">
        <h2 className="add-title">➕ Add Custom Platform</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="add-form">
          <label>Platform Name</label>
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="e.g. GFG"
            required
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. jyoshna123"
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />

          <div className="button-group">
            {/* ✅ Back button */}
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/")}
            >
              ← Back
            </button>

            <button type="submit" className="save-btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlatform;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import api from "./api";

const basePlatforms = ["leetcode", "codeforces", "codechef", "hackerrank"];

const platformLogos = {
  leetcode:
    "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
  codeforces:
    "https://sta.codeforces.com/s/86931/images/codeforces-logo-with-telegram.png",
  codechef: "https://s3.amazonaws.com/codechef_shared/misc/fb-image-icon.png",
  hackerrank:
    "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
};

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable, one must always be different.",
  "Simplicity is the soul of efficiency.",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sideOpen, setSideOpen] = useState(false);
  const [user, setUser] = useState({});
  const [platformStats, setPlatformStats] = useState({});
  const [customPlatforms, setCustomPlatforms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dailyStatus, setDailyStatus] = useState({});
  const token = localStorage.getItem("token");

  const toggleSideNav = () => setSideOpen((p) => !p);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // ✅ Decode token
  useEffect(() => {
    if (!token) return navigate("/login");
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.username || "User",
        email: payload.email || "user@example.com",
        profileImage:
          payload.profileImage ||
          "https://cdn-icons-png.flaticon.com/512/847/847969.png",
      });
    } catch (err) {
      console.error("❌ Invalid token", err);
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch base platform stats
  const fetchPlatformStats = async () => {
    try {
      const stats = {};
      for (const p of basePlatforms) {
        const res = await api.get(`/${p}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        stats[p] = {
          username: data.username || "Not set",
          totalSolved: data.totalSolved || 0,
        };
      }
      setPlatformStats(stats);
    } catch (err) {
      console.error("❌ Failed to fetch base stats:", err);
    }
  };

  // ✅ Fetch custom platforms
  const fetchCustomPlatforms = async () => {
    try {
      const res = await api.get("/custom-platforms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomPlatforms(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch custom platforms:", err);
    }
  };

  useEffect(() => {
    fetchPlatformStats();
    fetchCustomPlatforms();
  }, []);

  // ✅ Handle delete
  const handleDeletePlatform = async (id) => {
    if (!window.confirm("Are you sure to delete this platform?")) return;
    try {
      await api.delete(`/custom-platforms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomPlatforms((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const allDone = basePlatforms.every((p) => dailyStatus[p]);

  return (
    <>
      {/* 🔝 Navbar */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="hamburger" onClick={toggleSideNav}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="logo">
            <img src="14.png" alt="Logo" />
          </div>
        </div>

        <div className="nav-right">
          <FontAwesomeIcon
            icon={faBell}
            className="daily-bell"
            onClick={() => navigate("/daily-activity")}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              color: allDone ? "#00ff7f" : "#0ca50cff",
            }}
          />
          <div
            className="user-profile"
            onClick={() => navigate("/profilechange")}
          >
            <img
              src={user.profileImage}
              alt="User"
              className="profile-img"
              style={{ width: "35px", height: "35px", borderRadius: "50%" }}
            />
            <div className="user-info">
              <span className="username">{user.username?.toUpperCase()}</span>
            </div>
          </div>
          <button className="logout-btn small" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* 📂 Sidebar */}
      <div className={`side-nav ${sideOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => navigate("/")}>← Dashboard</li>
          {basePlatforms.map((p) => (
            <li key={p} onClick={() => navigate(`/${p}`)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </li>
          ))}
          {customPlatforms.map((p) => (
            <li key={p._id} onClick={() => navigate(`/custom/${p.platform}`)}>
              {p.platform}
            </li>
          ))}
          <li onClick={() => navigate("/add-platform")}>➕ Add Platform</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      {/* 🌟 Dashboard */}
      <div className={`dashboard-main ${sideOpen ? "shifted" : ""}`}>
        <h1 className="welcome-text">
          Hello, {user.username?.toUpperCase()} 👋
        </h1>

        {/* 🔍 Search + Ask AI */}
        <div className="search-center">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Search platform..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="ask-ai-btn" onClick={() => navigate("/ask-ai")}>
            🤖 Ask AI
          </button>
        </div>

        <p className="quote-text">
          <i>{randomQuote}</i>
        </p>

        <div className="platform-grid">
          {/* 🟢 Default Platforms */}
          {basePlatforms
            .filter((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((platform) => {
              const stats =
                platformStats[platform] || { username: "Not set", totalSolved: 0 };
              return (
                <div
                  key={platform}
                  className="platform-card"
                  onClick={() => navigate(`/${platform}`)}
                >
                  <img
                    src={platformLogos[platform]}
                    alt={platform}
                    className={`platform-logo-small logo-${platform.toLowerCase()}`}
                  />
                  <h2>
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </h2>
                  <p>Username: {stats.username}</p>
                  <p>Total Solved: {stats.totalSolved}</p>
                </div>
              );
            })}

          {/* 🟣 Custom Platforms */}
          {customPlatforms
            .filter((p) =>
              p.platform.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((p) => (
              <div
                key={p._id}
                className="platform-card custom"
                onClick={() =>
                  navigate(`/custom/${encodeURIComponent(p.platform)}`)
                }
              >
                <img
                  src={
                    p.imageUrl ||
                    "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                  }
                  alt={p.platform}
                  className="platform-logo-small logo-custom"
                />
                <h2>{p.platform}</h2>
                <p>Username: {p.username}</p>
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePlatform(p._id);
                  }}
                  style={{ color: "red", cursor: "pointer", marginTop: "10px" }}
                />
              </div>
            ))}

          {/* ➕ Add Card */}
          <div
            className="platform-card add-card"
            onClick={() => navigate("/add-platform")}
          >
            <h2>➕ Add Platform</h2>
            <p>Add a new coding profile</p>
            <p>
              Total Platforms: {basePlatforms.length + customPlatforms.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

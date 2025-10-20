import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const quotes = [
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes.",
  "In order to be irreplaceable, one must always be different.",
  "Simplicity is the soul of efficiency."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  // Example: username of logged-in user
  const [username] = useState("Yadavally Jyoshna");

  const toggleSideNav = () => setSideOpen(!sideOpen);

  return (
    <>
      {/* Top Navigation */}
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
          <div className="user-profile">
            <img src="https://via.placeholder.com/40" alt="User Profile" />
            <span className="username">{username}</span>
          </div>
        </div>
      </nav>

      {/* Side Navigation */}
      <div className={`side-nav ${sideOpen ? 'open' : ''}`}>
        <ul>
          <li onClick={() => navigate('/leetcode')}>LeetCode</li>
          <li onClick={() => navigate('/codeforces')}>Codeforces</li>
          <li onClick={() => navigate('/codechef')}>CodeChef</li>
          <li onClick={() => navigate('/hackerrank')}>HackerRank</li>
          <li>Logout</li>
        </ul>
      </div>

      {/* Dashboard Content */}
      <div className={`dashboard-container ${sideOpen ? 'shifted' : ''}`}>
        <div className="dashboard-left">
          <h1>{username}</h1>
          <p>{randomQuote}</p>

          <div className="platform-grid">
            <div className="platform-card" onClick={() => navigate('/leetcode')}>
              <h2>LeetCode</h2>
              <p>Practice coding problems</p>
            </div>
            <div className="platform-card" onClick={() => navigate('/codeforces')}>
              <h2>Codeforces</h2>
              <p>Compete in contests</p>
            </div>
            <div className="platform-card" onClick={() => navigate('/codechef')}>
              <h2>CodeChef</h2>
              <p>Challenge yourself</p>
            </div>
            <div className="platform-card" onClick={() => navigate('/hackerrank')}>
              <h2>HackerRank</h2>
              <p>Improve your skills</p>
            </div>
          </div>
        </div>

        <div className="dashboard-right">
          <img src="12.png" alt="Person Coding" />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

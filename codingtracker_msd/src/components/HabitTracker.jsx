import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DA.css";
import { FaCalendarAlt, FaRedo, FaSave, FaArrowLeft } from "react-icons/fa";

const initialPlatforms = [
  "LeetCode",
  "GeeksforGeeks",
  "Codeforces",
  "CodeChef",
  "HackerRank",
].map((name) => ({
  name,
  tokens: 0,
  progress: 0,
  days: [false, false, false, false, false, false, false],
  checkIns: [],
  showCalendar: false,
}));

export default function PlatformTracker() {
  const [platforms, setPlatforms] = useState(() => {
    const saved = localStorage.getItem("platformProgress");
    return saved ? JSON.parse(saved) : initialPlatforms;
  });

  useEffect(() => {
    localStorage.setItem("platformProgress", JSON.stringify(platforms));
  }, [platforms]);

  const toggleDay = (index, dayIndex) => {
    const updated = [...platforms];
    const p = updated[index];
    const wasChecked = p.days[dayIndex];
    p.days[dayIndex] = !wasChecked;
    p.tokens += wasChecked ? -5 : 5;
    const checkedDays = p.days.filter(Boolean).length;
    p.progress = Math.round((checkedDays / 7) * 100);

    const today = new Date().toDateString();
    if (!wasChecked) {
      if (!p.checkIns.includes(today)) p.checkIns.push(today);
    } else {
      p.checkIns = p.checkIns.filter((d) => d !== today);
    }
    setPlatforms(updated);
  };

  const toggleCalendar = (index) => {
    const updated = [...platforms];
    updated[index].showCalendar = !updated[index].showCalendar;
    setPlatforms(updated);
  };

  const handleDateClick = (index, date) => {
    const updated = [...platforms];
    const p = updated[index];
    const dateStr = date.toDateString();

    if (p.checkIns.includes(dateStr)) {
      p.checkIns = p.checkIns.filter((d) => d !== dateStr);
      p.tokens -= 5;
    } else {
      p.checkIns.push(dateStr);
      p.tokens += 5;
    }

    setPlatforms(updated);
  };

  const tileContent = (p, date) => {
    const dateStr = date.toDateString();
    return p.checkIns.includes(dateStr) ? (
      <div className="dot"></div>
    ) : null;
  };

  const resetProgress = () => {
    if (window.confirm("Reset all progress?")) {
      setPlatforms(initialPlatforms);
      localStorage.removeItem("platformProgress");
    }
  };

  const saveProgress = () => {
    localStorage.setItem("platformProgress", JSON.stringify(platforms));
    alert("Progress saved ✅");
  };

  return (
    <div className="platform-page">
      <button className="back-top-btn" onClick={() => window.history.back()}>
        <FaArrowLeft /> Back
      </button>

      <div className="platform-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9846/9846136.png"
          alt="tracker-icon"
          className="platform-icon"
        />
        <h1>Platform Tracker</h1>
      </div>

      <h2 className="sub-title">Track Your Weekly Coding Progress 💻</h2>

      <div className="action-buttons">
        <button onClick={saveProgress} className="save-btn">
          <FaSave /> Save
        </button>
        <button onClick={resetProgress} className="reset-btn">
          <FaRedo /> Reset
        </button>
      </div>

      <table className="platform-table">
        <thead>
          <tr>
            <th>Platform</th>
            <th>Tokens</th>
            <th>Progress</th>
            <th>Calendar</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
            <th>Sun</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((p, i) => (
            <React.Fragment key={i}>
              <tr>
                <td className="platform-name">{p.name}</td>
                <td className="platform-tokens">{p.tokens}</td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${p.progress}%`,
                        transition: "width 0.4s ease-in-out",
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">{p.progress}%</span>
                </td>
                <td className="calendar-cell">
                  <FaCalendarAlt
                    className="calendar-icon"
                    onClick={() => toggleCalendar(i)}
                  />
                </td>
                {p.days.map((done, j) => (
                  <td key={j} onClick={() => toggleDay(i, j)}>
                    <input type="checkbox" checked={done} readOnly />
                  </td>
                ))}
              </tr>
              {p.showCalendar && (
                <tr className="calendar-row">
                  <td colSpan="11">
                    <Calendar
                      onClickDay={(date) => handleDateClick(i, date)}
                      tileContent={({ date }) => tileContent(p, date)}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

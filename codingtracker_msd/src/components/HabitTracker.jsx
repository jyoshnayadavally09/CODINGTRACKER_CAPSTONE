import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DA.css";
import { FaCalendarAlt } from "react-icons/fa";

const PlatformTracker = () => {
  const [platforms, setPlatforms] = useState([
    {
      name: "LeetCode",
      tokens: 0,
      progress: 0,
      days: [false, false, false, false, false, false, false],
      checkIns: [], // store actual calendar dates
      showCalendar: false,
    },
    {
      name: "GeeksforGeeks",
      tokens: 0,
      progress: 0,
      days: [false, false, false, false, false, false, false],
      checkIns: [],
      showCalendar: false,
    },
    {
      name: "Codeforces",
      tokens: 0,
      progress: 0,
      days: [false, false, false, false, false, false, false],
      checkIns: [],
      showCalendar: false,
    },
    {
      name: "CodeChef",
      tokens: 0,
      progress: 0,
      days: [false, false, false, false, false, false, false],
      checkIns: [],
      showCalendar: false,
    },
    {
      name: "HackerRank",
      tokens: 0,
      progress: 0,
      days: [false, false, false, false, false, false, false],
      checkIns: [],
      showCalendar: false,
    },
  ]);

  const toggleDay = (index, dayIndex) => {
    const updated = [...platforms];
    const platform = updated[index];
    const wasChecked = platform.days[dayIndex];
    platform.days[dayIndex] = !wasChecked;

    // Token logic
    platform.tokens += wasChecked ? -5 : 5;
    const checkedDays = platform.days.filter(Boolean).length;
    platform.progress = Math.round((checkedDays / 7) * 100);

    // Calendar marking (add today's date)
    const today = new Date().toDateString();
    if (!wasChecked) {
      if (!platform.checkIns.includes(today)) {
        platform.checkIns.push(today);
      }
    } else {
      platform.checkIns = platform.checkIns.filter((d) => d !== today);
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
    const platform = updated[index];
    const dateStr = date.toDateString();

    if (platform.checkIns.includes(dateStr)) {
      platform.checkIns = platform.checkIns.filter((d) => d !== dateStr);
      platform.tokens -= 5;
    } else {
      platform.checkIns.push(dateStr);
      platform.tokens += 5;
    }

    setPlatforms(updated);
  };

  const tileContent = (platform, date) => {
    const dateStr = date.toDateString();
    if (platform.checkIns.includes(dateStr)) {
      return <div className="dot"></div>;
    }
    return null;
  };

  return (
    <div className="platform-page">
      <div className="platform-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9846/9846136.png"
          alt="tracker-icon"
          className="platform-icon"
        />
        <h1>Platform Tracker</h1>
      </div>

      <h2 className="sub-title">Track Your Coding Progress by Tokens</h2>

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
                      style={{ width: `${p.progress}%` }}
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

      <button className="back-btn" onClick={() => window.history.back()}>
        ⬅ Back
      </button>
    </div>
  );
};

export default PlatformTracker;

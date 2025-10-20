import React, { useEffect, useState } from "react";
import "./LeetCode.css"; 

// Number of days for the heatmap (e.g., 365 for a year)
const HEATMAP_DAYS = 365;

export default function LeetCode() {
  const savedUser = localStorage.getItem("leetUsername") || "";
  const [username, setUsername] = useState(savedUser);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to generate consistent mock heatmap (0-4 levels, 0 is no activity)
  const generateMockHeatmap = () => {
    // Generate an array for the last HEATMAP_DAYS
    return Array(HEATMAP_DAYS).fill(0).map(() => Math.floor(Math.random() * 5)); // 0 to 4 activity levels
  };

  const fetchProfile = async (uname) => {
    if (!uname) return;
    setLoading(true);

    try {
      const res = await fetch(`https://leetcode-api-faisalshohag.vercel.app/${uname}`);
      const data = await res.json();

      const easySolved = Number(data.easySolved || 0);
      const mediumSolved = Number(data.mediumSolved || 0);
      const hardSolved = Number(data.hardSolved || 0);
      const totalSolved = easySolved + mediumSolved + hardSolved;
      
      const easyTotal = Number(data.totalEasy || 800); 
      const mediumTotal = Number(data.totalMedium || 1600);
      const hardTotal = Number(data.totalHard || 700);
      const totalOverall = easyTotal + mediumTotal + hardTotal;

      let fetchedHeatmap = generateMockHeatmap(); 
      // Integrate real heatmap data here if available from your API
      // Example: fetchedHeatmap = data.dailyActivity || generateMockHeatmap();

      setProfile({ 
        easySolved, mediumSolved, hardSolved, totalSolved,
        easyTotal, mediumTotal, hardTotal, totalOverall,
        heatmap: fetchedHeatmap 
      });
      localStorage.setItem("leetUsername", uname);
    } catch (err) {
      console.error("Error fetching LeetCode profile:", err);
      setProfile({ 
        easySolved: 50, mediumSolved: 40, hardSolved: 30, totalSolved: 120,
        easyTotal: 800, mediumTotal: 1600, hardTotal: 700, totalOverall: 3100,
        heatmap: generateMockHeatmap() 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetUsername = () => {
    const uname = prompt("Enter LeetCode username:", username || "");
    if (uname) {
      setUsername(uname);
      fetchProfile(uname);
    }
  };

  useEffect(() => {
    if (username) fetchProfile(username);
  }, [username]);

  if (!profile) return (
    <div className="leetcode-container purple-theme"> 
      <div className="leetcode-header">
        <h1>LeetCode Progress</h1>
      </div>
      <div style={{ textAlign: "center", paddingTop: 50 }}>
        <button className="leetcode-button" onClick={handleSetUsername}>Set Username</button>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );

  const { 
    easySolved, mediumSolved, hardSolved, totalSolved,
    easyTotal, mediumTotal, hardTotal, totalOverall,
    heatmap 
  } = profile;

  // Constants for SVG circular progress
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  const easyProgress = (easySolved / easyTotal) * 100;
  const mediumProgress = (mediumSolved / mediumTotal) * 100;
  const hardProgress = (hardSolved / hardTotal) * 100;

  const easyDashoffset = circumference - (easyProgress / 100) * circumference;
  const mediumDashoffset = circumference - (mediumProgress / 100) * circumference;
  const hardDashoffset = circumference - (hardProgress / 100) * circumference;


  const easyPortionOfTotal = totalSolved > 0 ? (easySolved / totalSolved) : 0;
  const mediumPortionOfTotal = totalSolved > 0 ? (mediumSolved / totalSolved) : 0;
  const hardPortionOfTotal = totalSolved > 0 ? (hardSolved / totalSolved) : 0;

  const totalSolvedPercentage = (totalSolved / totalOverall) * 100;
  
  const easySegmentLength = easyPortionOfTotal * (totalSolvedPercentage / 100) * circumference;
  const mediumSegmentLength = mediumPortionOfTotal * (totalSolvedPercentage / 100) * circumference;
  const hardSegmentLength = hardPortionOfTotal * (totalSolvedPercentage / 100) * circumference;


  // --- Heatmap Data Processing for 365 days ---
  const weeks = [];
  // Get the day of the week for the first day of the heatmap period
  // We want the last HEATMAP_DAYS days ending today.
  const today = new Date();
  let firstDayOfHeatmap = new Date();
  firstDayOfHeatmap.setDate(today.getDate() - (HEATMAP_DAYS - 1)); // -1 because today is day 1

  // Calculate the offset to start the first week on a Sunday (0) or Monday (1)
  // GitHub's heatmap typically starts with a Sunday at the top of the column.
  // LeetCode's heatmap typically starts with Monday. Let's aim for Monday (day 1).
  const firstDayOfWeekIndex = (firstDayOfHeatmap.getDay() + 6) % 7; // 0 for Monday, 6 for Sunday

  // Pad the beginning of the heatmap data so the first actual day aligns correctly
  // If first day is Wednesday (2), we need 2 empty slots (Mon, Tue)
  const paddedHeatmap = Array(firstDayOfWeekIndex).fill(null).concat(heatmap);

  let currentWeek = [];
  for (let i = 0; i < paddedHeatmap.length; i++) {
    currentWeek.push(paddedHeatmap[i]);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) { // Push any remaining days as a partial week
    weeks.push(currentWeek);
  }

  // Generate month labels based on the start date
  const monthLabels = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let currentDate = new Date(firstDayOfHeatmap);
  for (let i = 0; i < weeks.length; i++) {
    const startOfWeek = new Date(currentDate); // Copy current date for week start
    startOfWeek.setDate(currentDate.getDate() - (currentDate.getDay() - 1 + 7) % 7); // Set to Monday of current week

    const firstValidDayOfWeek = weeks[i].find(day => day !== null); // Find the first non-null day
    if (firstValidDayOfWeek !== undefined) { // Check if the week contains actual data
      const monthIndex = currentDate.getMonth();
      const monthYear = `${monthNames[monthIndex]}`;
      
      // Only add month label if it's a new month and the first day of the month is in this week or very close
      if (
          i === 0 || // Always show for the very first week
          (currentDate.getDate() <= 7 && !monthLabels.some(m => m.month === monthIndex)) || // Or if it's the start of a new month
          (monthLabels.length > 0 && monthLabels[monthLabels.length - 1].month !== monthIndex && currentDate.getDate() >= 1 && currentDate.getDate() <=7)
      ) {
          // Check if this month has already been added to avoid duplicates if month spans multiple weeks' labels
          if (!monthLabels.find(label => label.month === monthIndex && label.weekIndex === i)) {
            monthLabels.push({
                month: monthIndex,
                name: monthYear,
                weekIndex: i // Store the week index to position it
            });
          }
      }
    }
    
    // Advance current date by 7 days (one week) for the next iteration, considering padding
    currentDate.setDate(currentDate.getDate() + 7);
  }


  return (
    <div className="leetcode-container purple-theme"> 
      <div className="leetcode-header">
        <h1>LeetCode Progress</h1> 
        <div className="username-section">
          <strong className="leetcode-username">{username}</strong>
          <button className="leetcode-button leetcode-button-small" onClick={handleSetUsername}>Change</button>
        </div>
      </div>

      <div className="leetcode-stats-section">
        <h2>Solved Problems</h2>
        <div className="progress-circles-container">
          {/* Total Progress Circle (now segmented) */}
          <div className="progress-circle-item">
            <svg className="progress-circle-svg" width="120" height="120" viewBox="0 0 120 120">
              <circle
                className="progress-circle-bg"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
              />
              {/* Easy Segment */}
              <circle
                className="progress-circle-progress easy-progress-total"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{
                  strokeDasharray: `${easySegmentLength} ${circumference - easySegmentLength}`,
                  strokeDashoffset: circumference - easySegmentLength
                }}
              />
              {/* Medium Segment (starts after easy) */}
              <circle
                className="progress-circle-progress medium-progress-total"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{
                  strokeDasharray: `${mediumSegmentLength} ${circumference - mediumSegmentLength}`,
                  strokeDashoffset: circumference - (easySegmentLength + mediumSegmentLength)
                }}
              />
              {/* Hard Segment (starts after medium) */}
              <circle
                className="progress-circle-progress hard-progress-total"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{
                  strokeDasharray: `${hardSegmentLength} ${circumference - hardSegmentLength}`,
                  strokeDashoffset: circumference - (easySegmentLength + mediumSegmentLength + hardSegmentLength)
                }}
              />
              <text x="60" y="55" textAnchor="middle" className="progress-text-solved">{totalSolved}</text>
              <text x="60" y="75" textAnchor="middle" className="progress-text-label">Total</text>
            </svg>
          </div>

          {/* Individual Easy Progress Circle */}
          <div className="progress-circle-item">
            <svg className="progress-circle-svg" width="120" height="120" viewBox="0 0 120 120">
              <circle
                className="progress-circle-bg"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
              />
              <circle
                className="progress-circle-progress easy-progress"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{ strokeDasharray: circumference, strokeDashoffset: easyDashoffset }}
              />
              <text x="60" y="55" textAnchor="middle" className="progress-text-solved">{easySolved}</text>
              <text x="60" y="75" textAnchor="middle" className="progress-text-label">Easy</text>
            </svg>
          </div>

          {/* Individual Medium Progress Circle */}
          <div className="progress-circle-item">
            <svg className="progress-circle-svg" width="120" height="120" viewBox="0 0 120 120">
              <circle
                className="progress-circle-bg"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
              />
              <circle
                className="progress-circle-progress medium-progress"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{ strokeDasharray: circumference, strokeDashoffset: mediumDashoffset }}
              />
              <text x="60" y="55" textAnchor="middle" className="progress-text-solved">{mediumSolved}</text>
              <text x="60" y="75" textAnchor="middle" className="progress-text-label">Medium</text>
            </svg>
          </div>

          {/* Individual Hard Progress Circle */}
          <div className="progress-circle-item">
            <svg className="progress-circle-svg" width="120" height="120" viewBox="0 0 120 120">
              <circle
                className="progress-circle-bg"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
              />
              <circle
                className="progress-circle-progress hard-progress"
                cx="60"
                cy="60"
                r={radius}
                strokeWidth={strokeWidth}
                style={{ strokeDasharray: circumference, strokeDashoffset: hardDashoffset }}
              />
              <text x="60" y="55" textAnchor="middle" className="progress-text-solved">{hardSolved}</text>
              <text x="60" y="75" textAnchor="middle" className="progress-text-label">Hard</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="leetcode-activity-section">
        <h3>Activity Heatmap</h3>
        <div className="heatmap-container-wrapper"> {/* New wrapper for layout */}
            <div className="day-name-labels">
                <span>Mon</span>
                <span></span>
                <span>Wed</span>
                <span></span>
                <span>Fri</span>
                <span></span>
                <span>Sun</span>
            </div>
            <div className="heatmap-grid-area">
                <div className="month-labels">
                    {monthLabels.map((month, idx) => (
                        <span 
                            key={idx} 
                            className="month-label" 
                            style={{ gridColumnStart: month.weekIndex + 1 }}
                        >
                            {month.name}
                        </span>
                    ))}
                </div>
                <div className="heatmap-grid">
                    {weeks.map((week, wIdx) => (
                        <div key={wIdx} className="week-column">
                            {week.map((day, dIdx) => (
                                <div 
                                    key={`${wIdx}-${dIdx}`} 
                                    className={`day-square activity-level-${day === null ? 'null' : day}`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="leetcode-top-bar">
  <button className="back-button" onClick={() => window.history.back()}>
    ← Back
  </button>
</div>

        <div className="heatmap-legend">
          <span className="legend-label">Less</span>
          <div className="legend-colors">
            <div className="day-square activity-level-0"></div>
            <div className="day-square activity-level-1"></div>
            <div className="day-square activity-level-2"></div>
            <div className="day-square activity-level-3"></div>
            <div className="day-square activity-level-4"></div> {/* Added for 5 levels (0-4) */}
          </div>
          <span className="legend-label">More</span>
        </div>
      </div>

      <div className="leetcode-footer">
        <button className="leetcode-button" onClick={() => fetchProfile(username)}>Refresh Data</button>
      </div>
    </div>
    
  );
}

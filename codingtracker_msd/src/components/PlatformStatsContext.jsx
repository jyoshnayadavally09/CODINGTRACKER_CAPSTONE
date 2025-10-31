import React, { createContext, useState, useEffect } from "react";

export const PlatformStatsContext = createContext();

export const PlatformStatsProvider = ({ children }) => {
  const [platformStats, setPlatformStats] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      const platforms = ["leetcode", "codeforces", "codechef", "hackerrank"];
      const statsObj = {};

      for (let platform of platforms) {
        try {
          const res = await fetch(`http://localhost:3030/${platform}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            statsObj[platform] = data.map(d => ({
              username: d.username,
              easy: d.easySolved || 0,
              medium: d.mediumSolved || 0,
              hard: d.hardSolved || 0,
              totalSolved: d.totalSolved || 0
            }));
          } else {
            statsObj[platform] = [];
          }
        } catch {
          statsObj[platform] = [];
        }
      }

      setPlatformStats(statsObj);
    };

    fetchStats();
  }, [token]);

  const updatePlatformStats = (platform, stats) => {
    setPlatformStats(prev => ({
      ...prev,
      [platform]: stats
    }));
  };

  return (
    <PlatformStatsContext.Provider value={{ platformStats, updatePlatformStats }}>
      {children}
    </PlatformStatsContext.Provider>
  );
};

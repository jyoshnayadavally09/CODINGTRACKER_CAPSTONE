import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LeetCode from './components/LeetCode';
import Codeforces from './components/Codeforces';
import Codechef from './components/CodeChef';
import Hackerrank from './components/HackerRank';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leetcode" element={<LeetCode />} />
        <Route path="/codeforces" element={<Codeforces />} />
        <Route path="/codechef" element={<Codechef />} />
        <Route path="/hackerrank" element={<Hackerrank />} />
      </Routes>
    </Router>
  );
}

export default App;

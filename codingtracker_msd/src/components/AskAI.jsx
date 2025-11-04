import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ai.css";

export default function AskAI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // ✅ Render AI backend URL
  const API_BASE = "https://ai-m-0js9.onrender.com";

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/ai_history`);
      const data = await res.json();
      setHistory(data.reverse());
    } catch (err) {
      console.error("❌ Failed to load history:", err);
    }
  };

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch(`${API_BASE}/ask_ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input }),
      });

      const data = await res.json();

      if (res.ok && data.roadmap) {
        setResponse(data.roadmap);
        loadHistory();
      } else {
        setResponse("⚠️ AI server error: " + (data.error || "Unknown issue."));
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("⚠️ Cannot connect to AI server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setInput(item.topic);
    setResponse(item.roadmap);
  };

  return (
    <div className="ai-page">
      {/* === LEFT CHAT CARD === */}
      <div className="ai-chat">
        <div className="ai-card">
          <h1 className="title">Ask AI</h1>
          <div className="ai-input-group">
            <input
              type="text"
              placeholder="Enter topic (e.g., DSA, React, ML)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="ai-input"
            />
            <button className="ai-btn" onClick={handleAsk} disabled={loading}>
              {loading ? "Generating..." : "Ask"}
            </button>
          </div>

          <div className="ai-response">
            {loading ? (
              <p className="loading-text">⏳ Generating response...</p>
            ) : response ? (
              <div className="ai-roadmap">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {response}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="hint-text">Your response will appear here...</p>
            )}
          </div>
        </div>
      </div>

      {/* === RIGHT HISTORY === */}
      <div className="ai-history">
        <h3>AI History</h3>
        <div className="history-list">
          {history.length === 0 ? (
            <p className="empty-text">No questions yet</p>
          ) : (
            history.map((item, i) => (
              <div
                key={i}
                className="history-item"
                onClick={() => handleSelectHistory(item)}
              >
                {item.topic}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "./ai.css";

export default function AskAI() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [drawioFile, setDrawioFile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    setDrawioFile("");

    try {
      const res = await fetch("http://127.0.0.1:5000/ask_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: input }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.response) {
        setResponse(data.response);
        if (data.file) setDrawioFile(data.file); // ✅ backend returns filename
      } else {
        setResponse("⚠️ AI server error: " + (data.error || "Unknown issue."));
      }
    } catch (error) {
      console.error("Connection error:", error);
      setResponse("⚠️ Cannot connect to AI server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-ai-container">
      <h2>🤖 Ask AI for Coding Help</h2>

      <textarea
        className="ask-ai-input"
        placeholder="Ask me about DSA, Arrays, Web Dev..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="ask-ai-btn" onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      <div className="ask-ai-response">
        {loading ? "⏳ Generating your roadmap..." : response && (
          <>
            <h3>📘 AI Roadmap</h3>
            <pre>{response}</pre>
            {drawioFile && (
              <a
                href={`http://127.0.0.1:5000/files/${drawioFile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-drawio-btn"
              >
                🗺️ View Visual Roadmap
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}

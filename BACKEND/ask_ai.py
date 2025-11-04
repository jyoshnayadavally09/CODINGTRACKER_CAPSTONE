import os
import json
import time
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# === Load .env and API Key ===
load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("❌ Missing OPENROUTER_API_KEY in .env file")

app = Flask(__name__)
CORS(app)

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json",
    "HTTP-Referer": "http://localhost:3000",  # frontend URL
    "X-Title": "CodingTracker AI",
}

# === Store AI request history in memory ===
ai_history = []


# === AI Generation Function ===
def generate_roadmap(topic, retries=3):
    MODELS = [
        "openai/gpt-4o-mini",
        "openai/gpt-3.5-turbo",
    ]

    prompt = f"Create a detailed 3-month learning roadmap to master {topic}. Include weekly goals and key resources."

    for model in MODELS:
        for attempt in range(1, retries + 1):
            try:
                print(f"🔹 Attempt {attempt} using {model}...")
                res = requests.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers=HEADERS,
                    data=json.dumps({
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                    }),
                    timeout=30,
                )

                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]

                elif res.status_code == 429:
                    print(f"⚠️ Rate limit hit on {model}, retry {attempt}/{retries}")
                    time.sleep(3 * attempt)
                    continue

                else:
                    print(f"❌ API Error {res.status_code}: {res.text}")
                    return f"API Error {res.status_code}: {res.text}"

            except requests.RequestException as e:
                print(f"⚠️ Network error: {e}")
                time.sleep(2)

        print(f"🔄 Switching model after {retries} failed attempts.\n")

    return None


# === AI Request Endpoint ===
@app.route("/ask_ai", methods=["POST"])
def ask_ai():
    data = request.get_json()
    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({"error": "Topic cannot be empty"}), 400

    print(f"🧠 Generating roadmap for topic: {topic}")
    roadmap = generate_roadmap(topic)

    if roadmap and not roadmap.startswith("API Error"):
        entry = {
            "topic": topic,
            "roadmap": roadmap,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        ai_history.append(entry)  # ✅ Save to memory
        return jsonify(entry)

    elif roadmap and roadmap.startswith("API Error"):
        return jsonify({"error": roadmap}), 500
    else:
        return jsonify({"error": "AI generation failed. Try again later."}), 500


# === Get AI History ===
@app.route("/ai_history", methods=["GET"])
def get_ai_history():
    return jsonify(ai_history)


# === Clear AI History ===
@app.route("/clear_history", methods=["DELETE"])
def clear_ai_history():
    ai_history.clear()
    return jsonify({"message": "AI history cleared"})


# === Default Route ===
@app.route("/")
def home():
    return jsonify({"message": "✅ AI Roadmap Flask Server is running!"})


# === Run Server ===
if __name__ == "__main__":
    app.run(debug=True, port=5000)

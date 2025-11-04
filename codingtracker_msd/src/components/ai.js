import axios from "axios";

// ✅ AI backend connection (Flask on Render)
const ai = axios.create({
  baseURL: "https://ai-m-0js9.onrender.com", // your live AI backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default ai;

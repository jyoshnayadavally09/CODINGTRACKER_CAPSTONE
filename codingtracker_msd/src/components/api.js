import axios from "axios";

const api = axios.create({
  baseURL: "https://codingtracker-capstone-7.onrender.com", // ✅ no /api here
});

export default api;
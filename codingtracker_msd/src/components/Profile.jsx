import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile({ token, onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return onLogout();

    axios
      .get("https://codingtracker-capstone-8.onrender.com/profile", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ fixed template literal
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        console.error("Profile fetch error:", err.message);
        onLogout();
      });
  }, [token, onLogout]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Your Profile</h2>

      {user ? (
        <div>
          <p>
            <b>Username:</b> {user.username}
          </p>
          <p>✅ You are logged in!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <button onClick={onLogout} style={{ marginTop: "20px" }}>
        Logout
      </button>
    </div>
  );
}

export default Profile;

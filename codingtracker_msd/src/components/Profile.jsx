import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile({ token, onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3030/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => setUser(res.data.user))
    .catch(() => onLogout());
  }, [token, onLogout]);

  return (
    <div>
      <h2>Your Profile</h2>
      {user ? (
        <div>
          <p><b>Username:</b> {user.username}</p>
          <p>✅ You are logged in!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

export default Profile;

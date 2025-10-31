import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileChange.css";

const ProfileChange = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    qualification: "",
    profileImage: "",
    resume: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        username: payload.username || "",
        email: payload.email || "",
        qualification: payload.qualification || "",
        profileImage: payload.profileImage || "",
        resume: payload.resume || "",
      });
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, profileImage: reader.result }); // store Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({ ...user, resume: file.name });
    }
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const updatedPayload = { ...payload, ...user };
      const newToken =
        `${token.split(".")[0]}.` +
        btoa(JSON.stringify(updatedPayload)) +
        `.${token.split(".")[2]}`;
      localStorage.setItem("token", newToken);
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating token:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <h2>Profile Settings</h2>

        <div className="profile-img-section">
          <img
            src={
              user.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png"
            }
            alt="Profile"
            className="profile-img"
          />
          <label className="upload-btn">
            Upload Image
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="profile-fields">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Qualification</label>
            <input
              type="text"
              name="qualification"
              placeholder="Enter your qualification"
              value={user.qualification}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Upload Resume</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            {user.resume && <p className="resume-name">Uploaded: {user.resume}</p>}
          </div>
        </div>

        <div className="profile-actions">
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
          <button className="cancel-btn" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileChange;

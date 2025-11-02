const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas Connection
mongoose
  .connect(
    "mongodb+srv://yadavallyjyoshna200609_db_user:QPHYIgwRurWGjMOh@cluster0.1cb9jbq.mongodb.net/codingtracker_msd?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB Atlas Connection Error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// ✅ Platform Schema Factory
function createPlatformModel(platform) {
  const schema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true },
    username: { type: String, required: true },
    easySolved: { type: Number, default: 0 },
    mediumSolved: { type: Number, default: 0 },
    hardSolved: { type: Number, default: 0 },
    totalSolved: { type: Number, default: 0 },
    imageUrl: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now },
  });
  return mongoose.models[platform] || mongoose.model(platform, schema);
}

// Default platform models
const Leetcode = createPlatformModel("Leetcode");
const Codeforces = createPlatformModel("Codeforces");
const Hackerrank = createPlatformModel("Hackerrank");
const Codechef = createPlatformModel("Codechef");
const CustomPlatform = createPlatformModel("CustomPlatform");

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ message: "No token provided" });
    req.user = jwt.verify(token, "sectionA");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// ✅ Register
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "Registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ✅ Login
app.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user || user.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, username: user.username }, "sectionA", { expiresIn: "2h" });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ✅ Platform Routes Function
function platformRoutes(path, Model, name) {
  // GET
  app.get(path, verifyToken, async (req, res) => {
    try {
      const stats = await Model.findOne({ userId: req.user.id });
      if (!stats)
        return res.json({
          username: req.user.username,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          totalSolved: 0,
        });
      res.json(stats);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Fetch error" });
    }
  });

  // POST
  app.post(path, verifyToken, async (req, res) => {
    try {
      const { username, easySolved = 0, mediumSolved = 0, hardSolved = 0, imageUrl = "" } = req.body;
      const totalSolved = Number(easySolved) + Number(mediumSolved) + Number(hardSolved);

      const stats = await Model.findOneAndUpdate(
        { userId: req.user.id },
        {
          userId: req.user.id,
          platform: name,
          username,
          easySolved,
          mediumSolved,
          hardSolved,
          totalSolved,
          imageUrl,
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({ message: "Saved successfully", data: stats });
    } catch (err) {
      console.error("❌ Save error:", err);
      res.status(500).json({ message: "Save failed", error: err.message });
    }
  });
}

// Apply platform routes
platformRoutes("/leetcode", Leetcode, "Leetcode");
platformRoutes("/codeforces", Codeforces, "Codeforces");
platformRoutes("/hackerrank", Hackerrank, "Hackerrank");
platformRoutes("/codechef", Codechef, "Codechef");

// ✅ Custom Platforms
app.get("/custom-platforms", verifyToken, async (req, res) => {
  try {
    const list = await CustomPlatform.find({ userId: req.user.id });
    res.json(list);
  } catch (err) {
    console.error("❌ Fetch custom platforms error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
});

app.post("/custom-platforms", verifyToken, async (req, res) => {
  try {
    const { platform, username, easySolved = 0, mediumSolved = 0, hardSolved = 0, imageUrl = "" } = req.body;

    if (!platform || !username)
      return res.status(400).json({ message: "Platform and username required" });

    const totalSolved = Number(easySolved) + Number(mediumSolved) + Number(hardSolved);
    const existing = await CustomPlatform.findOne({ userId: req.user.id, platform });

    if (existing) {
      existing.username = username;
      existing.easySolved = easySolved;
      existing.mediumSolved = mediumSolved;
      existing.hardSolved = hardSolved;
      existing.totalSolved = totalSolved;
      existing.imageUrl = imageUrl;
      existing.updatedAt = new Date();
      await existing.save();
      return res.json({ message: "Updated successfully", data: existing });
    }

    const created = await CustomPlatform.create({
      userId: req.user.id,
      platform,
      username,
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
      imageUrl,
    });

    res.json({ message: "Created successfully", data: created });
  } catch (err) {
    console.error("❌ Custom platform error:", err);
    res.status(500).json({ message: "Custom save failed", error: err.message });
  }
});

// ✅ Delete Custom Platform
app.delete("/custom-platforms/:id", verifyToken, async (req, res) => {
  try {
    await CustomPlatform.findByIdAndDelete(req.params.id);
    res.json({ message: "Platform deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

// ✅ Dynamic Custom Routes
app.get("/:platform", verifyToken, async (req, res) => {
  try {
    const { platform } = req.params;
    let Model = mongoose.models[platform] || createPlatformModel(platform);
    const stats = await Model.findOne({ userId: req.user.id });

    if (!stats) {
      return res.json({
        username: req.user.username,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        totalSolved: 0,
      });
    }

    res.json(stats);
  } catch (err) {
    console.error("❌ Fetch failed:", err);
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
});

app.post("/:platform", verifyToken, async (req, res) => {
  try {
    const { platform } = req.params;
    const { username, easySolved = 0, mediumSolved = 0, hardSolved = 0, imageUrl = "" } = req.body;
    const totalSolved = Number(easySolved) + Number(mediumSolved) + Number(hardSolved);

    let Model = mongoose.models[platform] || createPlatformModel(platform);

    const stats = await Model.findOneAndUpdate(
      { userId: req.user.id },
      {
        userId: req.user.id,
        platform,
        username,
        easySolved,
        mediumSolved,
        hardSolved,
        totalSolved,
        imageUrl,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ message: "✅ Saved successfully", data: stats });
  } catch (err) {
    console.error("❌ Save failed:", err);
    res.status(500).json({ message: "Save failed", error: err.message });
  }
});

// ✅ Start Server
app.listen(3030, () => console.log("🚀 Server running on port 3030"));

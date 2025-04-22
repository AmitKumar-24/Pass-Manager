const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_secret_key"; // ⚠️ Change this to a secure secret in production

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/passop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);

// Password Schema
const passwordSchema = new mongoose.Schema({
  site: String,
  username: String,
  password: String,
});
const Password = mongoose.model("Password", passwordSchema);

// Register Route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({ token });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Password Routes (Protected)
app.get("/api/passwords", authenticateToken, async (req, res) => {
  try {
    const passwords = await Password.find();
    res.status(200).json(passwords);
  } catch (err) {
    res.status(500).json({ message: "Error fetching passwords!" });
  }
});

app.post("/api/passwords", authenticateToken, async (req, res) => {
  try {
    const passwordEntry = await Password.create(req.body);
    res.status(201).json(passwordEntry);
  } catch (err) {
    res.status(500).json({ message: "Error saving password!" });
  }
});

app.put("/api/passwords/:id", authenticateToken, async (req, res) => {
  try {
    const updated = await Password.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating password!" });
  }
});

app.delete("/api/passwords/:id", authenticateToken, async (req, res) => {
  try {
    await Password.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Password deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting password!" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

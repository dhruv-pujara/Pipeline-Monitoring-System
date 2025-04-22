import express from "express"
import mysql from "mysql"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "PIPELINE_SYSTEM",
})

// Test API
app.get("/", (req, res) => {
  res.json("Hello! This is the backend.")
})

// Register User (Signup)
app.post("/register", (req, res) => {
  const { name, username, email, phone, password, role } = req.body
  const q = "INSERT INTO Login (`name`, `username`, `email`, `phone`, `password_hash`, `role`) VALUES (?)"
  const values = [name, username, email, phone, password, role]

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err)
    return res.status(201).json({ message: "User registered successfully" })
  })
})

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body
  const q = "SELECT * FROM Login WHERE username = ?"

  db.query(q, [username], (err, results) => {
    if (err) return res.status(500).json(err)
    if (results.length === 0) return res.status(401).json({ error: "User not found" })

    const user = results[0]

    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid password" })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" })
    return res.status(200).json({ message: "Login successful", token, role: user.role })
  })
})

// To get all users in the database
app.get("/users", (req, res) => {
  const q1 = "SELECT id, name, username, email, phone, password_hash AS password, role, created_at FROM Login ORDER BY id";
  db.query(q1, (err, results) => {
    if (err) {
      console.error("DB error fetching users:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});


// To update users login information
app.post("/update", (req, res) => {
  const { id, name, username, email, phone, password, role } = req.body;
  const q = `
    UPDATE Login
    SET 
      name = ?, 
      username = ?, 
      email = ?, 
      phone = ?, 
      password_hash = ?, 
      role = ?
    WHERE id = ?
  `;

  const values = [name, username, email, phone, password, role, id];

  db.query(q, values, (err, result) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json({ message: "User updated successfully" });
  });
});

// To delete a user 
app.post("/delete", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required for deletion." });
  }

  const q = "DELETE FROM Login WHERE id = ?";

  db.query(q, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Database error while deleting user." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or already deleted." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  });
});

// Protected Dashboard Route (requires token)
app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the Dashboard", user: req.user })
})

// JWT Middleware
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(403).json({ error: "Unauthorized" })

  jwt.verify(token, "your_jwt_secret", (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" })
    req.user = user
    next()
  })
}


// Start server
app.listen(8800, () => {
  console.log("Backend server is running on port 8800!!")
})


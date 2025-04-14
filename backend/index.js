// import express from "express"
// import mysql from "mysql"
// import jwt from "jsonwebtoken"
// import cors from "cors"

// const app = express()
// app.use(express.json()) // Middleware to parse JSON
// app.use(cors()) // Enable CORS for frontend access

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "PIPELINE_SYSTEM",
// })

// // Test API
// app.get("/", (req, res) => {
//   res.json("Hello! This is the backend.")
// })

// // Register User (Signup) – without hashing
// app.post("/register", (req, res) => {
//   const { name, username, email, phone, password, role } = req.body

//   const q = "INSERT INTO Login (`name`, `username`, `email`, `phone`, `password`, `role`) VALUES (?)"
//   const values = [name, username, email, phone, password, role]

//   db.query(q, [values], (err, data) => {
//     if (err) return res.status(500).json(err)
//     return res.status(201).json({ message: "User registered successfully" })
//   })
// })

// // Login API – without comparing hashed passwords
// app.post("/login", (req, res) => {
//   const { username, password } = req.body
//   const q = "SELECT * FROM Login WHERE username = ?"

//   db.query(q, [username], (err, results) => {
//     if (err) return res.status(500).json(err)
//     if (results.length === 0) return res.status(401).json({ error: "User not found" })

//     const user = results[0]

//     if (user.password_hash !== password) {
//       return res.status(401).json({ error: "Invalid password" })
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" })

//     res.status(200).json({ message: "Login successful", token, role: user.role })
//   })
// })

// // Protected route
// app.get("/dashboard", authenticateToken, (req, res) => {
//   res.json({ message: "Welcome to the Dashboard", user: req.user })
// })

// function authenticateToken(req, res, next) {
//   const token = req.headers.authorization?.split(" ")[1]
//   if (!token) return res.status(403).json({ error: "Unauthorized" })

//   jwt.verify(token, "your_jwt_secret", (err, user) => {
//     if (err) return res.status(403).json({ error: "Invalid token" })
//     req.user = user
//     next()
//   })
// }

// app.post("/login", (req, res) => {
//     const { username, password } = req.body
//     const q = "SELECT * FROM Login WHERE username = ?"
  
//     db.query(q, [username], (err, results) => {
//       if (err) {
//         console.error("Query error:", err)
//         return res.status(500).json(err)
//       }
  
//       if (results.length === 0) {
//         console.log("No user found with username:", username)
//         return res.status(401).json({ error: "User not found" })
//       }
  
//       const user = results[0]
  
//       // Log both values for debugging
//       console.log("Password entered:", password)
//       console.log("Password in DB (password_hash):", user.password_hash)
  
//       if (user.password_hash !== password) {
//         return res.status(401).json({ error: "Invalid password" })
//       }
  
//       const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" })
//       return res.status(200).json({ message: "Login successful", token, role: user.role })
//     })
//   })
  

// // Start the server
// app.listen(8800, () => {
//   console.log("Backend server is running on port 8800!!")
// })


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

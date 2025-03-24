// import express from "express"
// import mysql from "mysql"

// const app = express()
// const db= mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"PIPELINE_SYSTEM"
// })

// app.get("/", (req, res) => {
//     res.json("hello this is the backend")
// })

// app.get("/Login", (req, res) => {
//     const q = "SELECT * FROM Login"
//     db.query(q, (err, data) => {
//         if(err) return res.json(err)
//         return res.json(data)
//     })
// })

// app.post("/Login", (req, res) => {
//     const q = "INSERT INTO Login (`name`, `username`,`email`,`phone`,`password`, `role`) VALUES (?)"
//     const values = [
//         req.body.name,
//         req.body.username,
//         req.
//         req.body.email,
//         req.body.password
//     ]

//     db.query(q, [values], (err, data) => {
//         if(err) return res.json(err)
//         return res.json("Login has been created successfully")
//     })
// })

// app.listen(8800, () => {
//     console.log("Backend server is running!!")
// })

import express from "express"
import mysql from "mysql"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import cors from "cors"

const app = express()
app.use(express.json()) // Middleware to parse JSON
app.use(cors()) // Enable CORS for frontend access

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "PIPELINE_SYSTEM",
})

// 📌 Test API
app.get("/", (req, res) => {
    res.json("Hello! This is the backend.")
})

// ✅ Register User (Signup)
app.post("/register", async (req, res) => {
    const { name, username, email, phone, password, role } = req.body

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10)

    const q = "INSERT INTO Login (`name`, `username`, `email`, `phone`, `password`, `role`) VALUES (?)"
    const values = [name, username, email, phone, hashedPassword, role]

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(201).json({ message: "User registered successfully" })
    })
})

// ✅ Login API (Authenticate User)
app.post("/login", (req, res) => {
    const { username, password } = req.body
    const q = "SELECT * FROM Login WHERE username = ?"

    db.query(q, [username], async (err, results) => {
        if (err) return res.status(500).json(err)
        if (results.length === 0) return res.status(401).json({ error: "User not found" })

        const user = results[0]

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ error: "Invalid password" })

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", { expiresIn: "1h" })

        res.status(200).json({ message: "Login successful", token, role: user.role })
    })
})


app.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the Dashboard", user: req.user })
})


function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(403).json({ error: "Unauthorized" })

    jwt.verify(token, "your_jwt_secret", (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" })
        req.user = user
        next()
    })
}

// ✅ Start Server
app.listen(8800, () => {
    console.log("Backend server is running on port 8800!!")
})

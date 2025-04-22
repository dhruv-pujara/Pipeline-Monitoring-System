
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

app.get("/inspections", authenticateToken, (req, res) => {
  const q = "SELECT * FROM INSPECTION"
  
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json(results)  // Send the inspection data to the frontend
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

// Get all pipelines
app.get("/pipelines", authenticateToken, (req, res) => {
  const q = "SELECT * FROM PIPELINE";
  
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(results);
  });
});


// Add a new pipeline
app.post("/pipelines", authenticateToken, (req, res) => {
  const { PipelineID, Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude } = req.body;
  
  const q = "INSERT INTO PIPELINE (Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude) VALUES (?)";
  const values = [PipelineID, Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude];
  
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "Pipeline added successfully" });
  });
});


// Delete a pipeline
app.delete("/pipelines/:id", authenticateToken, (req, res) => {
  const pipelineId = req.params.id;
  
  const q = "DELETE FROM PIPELINE WHERE PipelineID = ?";
  
  db.query(q, [pipelineId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Pipeline deleted successfully" });
  });
});


// Get all segments
app.get("/segments", authenticateToken, (req, res) => {
  const q = "SELECT * FROM SEGMENT";
  
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(results);
  });
});


// Add a new segment
app.post("/segments", authenticateToken, (req, res) => {
  const { segmentId, PipelineID, PressureLevel, FlowRate, LastModifiedDate } = req.body;
  
  const q = "INSERT INTO SEGMENT (PipelineID, PressureLevel, FlowRate, LastModifiedDate) VALUES (?)";
  const values = [segmentId, PipelineID, PressureLevel, FlowRate, LastModifiedDate];
  
  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ message: "Segment added successfully" });
  });
});


// Delete a segment
app.delete("/segments/:id", authenticateToken, (req, res) => {
  const segmentId = req.params.id;
  
  const q = "DELETE FROM SEGMENT WHERE SegmentID = ?";
  
  db.query(q, [segmentId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Segment deleted successfully" });
  });
});



// Start server
app.listen(8800, () => {
  console.log("Backend server is running on port 8800!!")
})

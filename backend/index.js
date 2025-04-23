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
});

// Test API
app.get("/", (req, res) => {
  res.json("Hello! This is the backend.")
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT * FROM Login WHERE username = ?";

  db.query(q, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];

    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});

// Find Inspector Inspections
app.post("/my-inspections", (req, res) => {
  const inspectorID = req.body.inspectorID;

  if (!inspectorID) {
    return res.status(400).json({ error: "Inspector ID required" });
  }

  const q = `
    SELECT InspectionID, PipelineID, InspectorID, SegmentID, InspectionDate, Findings
    FROM inspection
    WHERE InspectorID = ?
    ORDER BY InspectionID
  `;

  db.query(q, [inspectorID], (err, rows) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
});

// Update Inspection
app.post("/updateInspection", (req, res) => {
  const { inspectionID, inspectionDate, findings } = req.body;

  if (!inspectionID) return res.status(400).json({ error: "Missing inspection ID" });

  const checkQuery = "SELECT InspectionDate, Findings FROM inspection WHERE InspectionID = ?";
  db.query(checkQuery, [inspectionID], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!rows.length) return res.status(404).json({ error: "Inspection not found" });

    const alreadySubmitted = rows[0].InspectionDate && rows[0].Findings;
    if (alreadySubmitted) return res.status(409).json({ error: "Already submitted" });

    const updateQuery = "UPDATE inspection SET InspectionDate = ?, Findings = ? WHERE InspectionID = ?";
    db.query(updateQuery, [inspectionDate, findings, inspectionID], (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ success: true, message: "Inspection updated" });
    });
  });
});

// Route: Get completed inspections for logged-in inspector
app.post("/inspector/completed-inspections", (req, res) => {
  const { inspectorID } = req.body;

  if (!inspectorID) {
    return res.status(400).json({ error: "Inspector ID is required" });
  }

  const sql = `
    SELECT * FROM inspection
    WHERE InspectorID = ? 
      AND InspectionDate IS NOT NULL 
      AND Findings IS NOT NULL
    ORDER BY InspectionID
  `;

  db.query(sql, [inspectorID], (err, rows) => {
    if (err) {
      console.error("Error fetching completed inspections:", err);
      return res.status(500).json({ error: "Database error" });
    }
    return res.status(200).json(rows);
  });
});

// Route: Add an issue for an inspection
app.post("/inspector/report-issue", (req, res) => {
  const { InspectionID, IssueType, Severity } = req.body;

  if (!InspectionID || !IssueType || !Severity) {
    return res.status(400).json({ error: "Missing fields in issue report" });
  }

  const q = `
    INSERT INTO issue (InspectionID, IssueType, Severity)
    VALUES (?, ?, ?)
  `;

  db.query(q, [InspectionID, IssueType, Severity], (err, result) => {
    if (err) {
      console.error("Error inserting issue:", err);
      return res.status(500).json({ error: "Database insert error" });
    }

    return res.status(201).json({ message: "Issue reported", issueID: result.insertId });
  });
});

// POST /inspector/completed-inspections
app.post("/inspector/completed-inspections", (req, res) => {
  const { inspectorID } = req.body;
  if (!inspectorID) {
    return res.status(400).json({ error: "Inspector ID is required" });
  }
  const sql = `
    SELECT
      InspectionID,
      PipelineID,
      SegmentID,
      DATE_FORMAT(InspectionDate, '%Y-%m-%d') AS InspectionDate,
      Findings
    FROM inspection
    WHERE InspectorID = ?
      AND InspectionDate IS NOT NULL
      AND Findings IS NOT NULL
    ORDER BY InspectionID
  `;
  db.query(sql, [inspectorID], (err, rows) => {
    if (err) {
      console.error("DB error fetching completed inspections:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// GET /inspection/:id/issues
app.get("/inspection/:id/issues", (req, res) => {
  const inspectionID = Number(req.params.id);
  if (!inspectionID) {
    return res.status(400).json({ error: "Inspection ID is required" });
  }
  const sql = `
    SELECT
      IssueID,
      IssueType,
      Severity
    FROM issue
    WHERE InspectionID = ?
    ORDER BY IssueID
  `;
  db.query(sql, [inspectionID], (err, rows) => {
    if (err) {
      console.error("DB error fetching issues:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});





app.post("/register", (req, res) => {
  const { name, username, email, phone, password, role } = req.body;

  const insertLogin = `
    INSERT INTO Login (name, username, email, phone, password_hash, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const loginValues = [name, username, email, phone, password, role];

  db.query(insertLogin, loginValues, (err, result) => {
    if (err) {
      // Detailed duplicate field error messages
      if (err.code === 'ER_DUP_ENTRY') {
        if (err.sqlMessage.includes('username')) {
          return res.status(400).json({ message: "Username already exists" });
        }
        if (err.sqlMessage.includes('email')) {
          return res.status(400).json({ message: "Email already exists" });
        }
        if (err.sqlMessage.includes('phone')) {
          return res.status(400).json({ message: "Phone number already exists" });
        }
        return res.status(400).json({ message: "Duplicate entry detected" });
      }
      //Debug
      console.error("Error inserting into Login:", err);
      return res.status(500).json({ message: "Server error during registration" });
    }

    const userId = result.insertId;

    if (role.toLowerCase() === "inspector") {
      const insertInspector = `
        INSERT INTO Inspector (InspectorID, Name, Phone, Email)
        VALUES (?, ?, ?, ?)
      `;
      const inspectorValues = [userId, name, phone, email];

      db.query(insertInspector, inspectorValues, (inspectorErr) => {
        if (inspectorErr) {
          return res.status(500).json({ message: "User created, but failed to register inspector info" });
        }

        return res.status(201).json({ message: "Inspector registered successfully" });
      });
    } else {
      return res.status(201).json({ message: "User registered successfully" });
    }
  });
});


app.get("/inspections", authenticateToken, (req, res) => {
  const q = "SELECT * FROM INSPECTION"
  
  db.query(q, (err, results) => {
    if (err) return res.status(500).json(err)
    return res.status(200).json(results)
  })
})


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const q = "SELECT * FROM Login WHERE username = ?";

  db.query(q, [username], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "User not found" });

    const user = results[0];

    if (user.password_hash !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      id: user.id,
      name: user.name,
      email: user.email
    });
  });
});



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
// app.post("/update", (req, res) => {
//   const { id, name, username, email, phone, password, role } = req.body;
//   const q = `
//     UPDATE Login
//     SET 
//       name = ?, 
//       username = ?, 
//       email = ?, 
//       phone = ?, 
//       password_hash = ?, 
//       role = ?
//     WHERE id = ?
//   `;

//   const values = [name, username, email, phone, password, role, id];

//   db.query(q, values, (err, result) => {
//     if (err) {
//       console.error("Error updating user:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     res.status(200).json({ message: "User updated successfully" });
//   });
// });

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

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    return res.status(200).json({ message: "User updated successfully" });
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

app.get("/inspectors", (req, res) => {
  const q = "SELECT InspectorID, Name, Phone, Email FROM INSPECTOR";
  db.query(q, (err, results) => {
    if (err) {
      console.error("Error fetching inspectors:", err);
      return res.status(500).json({ error: "Failed to fetch inspectors" });
    }
    res.json(results);
  });
});

// 🔍 Get all pipelines
app.get("/pipelines", (req, res) => {
  const q = "SELECT * FROM Pipeline";
  db.query(q, (err, results) => {
    if (err) {
      console.error("Error fetching pipelines:", err);
      return res.status(500).json({ error: "Failed to fetch pipelines" });
    }
    res.json(results);
  });
});

// 🔍 Get all segments
app.get("/segments", (req, res) => {
  const q = "SELECT * FROM Segment";
  db.query(q, (err, results) => {
    if (err) {
      console.error("Error fetching segments:", err);
      return res.status(500).json({ error: "Failed to fetch segments" });
    }
    res.json(results);
  });
});

// // Assign an inspection
// app.post("/assign-inspection", (req, res) => {
//   const { inspectorId, pipelineId, segmentId } = req.body;
//   const q = `
//     INSERT INTO Inspection (PipelineID, InspectorID, SegmentID)
//     VALUES (?, ?, ?)
//   `;
//   db.query(q, [pipelineId, inspectorId, segmentId], (err, result) => {
//     if (err) {
//       console.error("Error assigning inspection:", err);
//       return res.status(500).json({ message: "Failed to assign inspection" });
//     }
//     res.json({ message: "Inspection successfully assigned" });
//   });
// });

// Assign an inspection
app.post("/assign-inspection", (req, res) => {
  const { inspectorId, pipelineId, segmentId } = req.body;

  const defaultDate = '0000-00-00';
  const defaultFindings = '-';

  const q = `
    INSERT INTO Inspection (PipelineID, InspectorID, SegmentID, InspectionDate, Findings)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(q, [pipelineId, inspectorId, segmentId, defaultDate, defaultFindings], (err, result) => {
    if (err) {
      console.error("Error assigning inspection:", err);
      return res.status(500).json({ message: "Failed to assign inspection" });
    }

    res.json({ message: "Inspection successfully assigned" });
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
  const { Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude } = req.body;
  
  const q = "INSERT INTO PIPELINE (Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude) VALUES (?)";
  const values = [Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude];
  
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
  const {PipelineID, PressureLevel, FlowRate, LastModifiedDate } = req.body;
  
  const q = "INSERT INTO SEGMENT (PipelineID, PressureLevel, FlowRate, LastModifiedDate) VALUES (?)";
  const values = [ PipelineID, PressureLevel, FlowRate, LastModifiedDate];
  
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

// must come after you define `authenticateToken`

// list all issues
app.get("/issues", authenticateToken, (req, res) => {
  db.query("SELECT * FROM ISSUE", (err, rows) => {
    if (err) {
      console.error("Error fetching issues:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// fetch one issue by its IssueID
app.get("/issues/:id", authenticateToken, (req, res) => {
  db.query(
    "SELECT * FROM ISSUE WHERE IssueID = ?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        console.error("Error fetching issue:", err);
        return res.status(500).json(err);
      }
      if (rows.length === 0) return res.status(404).json({ error: "Not found" });
      res.json(rows[0]);
    }
  );
});






// Start server
app.listen(8800, () => {
  console.log("Backend server is running on port 8800!!")
});


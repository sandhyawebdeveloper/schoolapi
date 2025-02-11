const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get a student by ID
app.get("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM students WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(result[0]);
  });
});

// Add a new student
app.post("/students", (req, res) => {
  const { name, roll_no, class: studentClass, age } = req.body;
  db.query(
    "INSERT INTO students (name, roll_no, class, age) VALUES (?, ?, ?, ?)",
    [name, roll_no, studentClass, age],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Student added successfully", id: result.insertId });
    }
  );
});

// Update student details
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, roll_no, class: studentClass, age } = req.body;
  db.query(
    "UPDATE students SET name = ?, roll_no = ?, class = ?, age = ? WHERE id = ?",
    [name, roll_no, studentClass, age, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Student updated successfully" });
    }
  );
});

// Delete a student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Student deleted successfully" });
  });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;
const mongoose = require("mongoose");
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");



// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./models/Cohort.model"); 
const students = require("./models/Student.model");




// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors({
  origin: [`http://localhost:5173`, "http://example.com"] // URLs allowed to enter
}))
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// connecting to mongodb
mongoose.connect("mongodb://localhost:27017/cohort-tools-api", {
})
  .then(() => console.log("Connectec to MongoDB successfully!"))
  .catch(error => console.log("Failed to connect to MongoDB", error))



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// Create new cohort
app.post("/api/cohorts", async (req, res) => {
  try {
    const cohort = new Cohort(req.body);
    const savedCohort = await cohort.save();
    res.status(201).json(savedCohort);
  } catch (error) {
    res.status(400).json({ message: "Error creating cohort", error});
  }
});

// Retrieve all cohorts
app.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await Cohort.find();
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({message: "Error fetching cohorts", error});
  }
});

// Retrieve specific cohort by ID
app.get("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.cohortId);
    if (!cohort) return res.status(404).json({message: "Cohort not found"});
    res.json(cohort);
  } catch (error) {
    res.status(500).json({message: "Error fetching cohort", error});
  }
});

// Updates a specific cohort ID 
app.put("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohort.findByIdAndUpdate(req.params.cohortId, req.body, {new:true});
    if (!cohort) return res.status(404).json({message: "Cohort not found"});
    res.json(cohort);
  } catch (error) {
    res.status(400).json({message: "Error updating cohort", error});
  }
});

// Deletes a specific cohort ID
app.delete("/api/cohorts/:cohortId", async (req, res) => {
  try {
    const cohort = await Cohort.findByIdAndDelete(req.params.cohortId);
    if (!cohort) return res.status(404).json({message: "Cohort not found"});
    res.status(204).send(); // send empty if not found 
  } catch {error} {
    res.status(500).json({message: "Error deleting cohort", error});
  }
});

// Create new Student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({message: "Error creating student", error});
  }
});

// Retrieve all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().populate("cohort");
    res.json(students);
  } catch (error) {
    res.status(500).json({message: "Error fetching students", error});
  }
});

// Retrieve students for a cohort
app.get("/api/students/cohort/:cohortId", async (req, res) => {
  try {
    const students = await Student.find({cohort: req.params.cohortId}).populate("cohort");
    res.json(students);
  } catch (error) {
    res.status(500).json({message: "Error fetching students", error});
  }
});

// Retrieve a specific student by ID 
app.get("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).populate("cohort");
    if (!student) return res.status(404).json({message: "Student not found", error});
    res.json(student);
  } catch (error) {
    res.status(400).json({message: "Error fetching student", error});
  }
});

// Update a specific student by ID 
app.put("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.studentId, req.body, {new:true});
    if (!student) return res.status(404).json({message: "Student not found"});
    res.json(student);
  } catch (error) {
    res.status(400).json({message: "Error updating student", error});
  }
});

// Delete a specific student by ID 
app.delete("/api/students/:studentId", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.studentId);
    if(!student) return res.status(404).json({message: "student not found"});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({message: "Error deleting student", error});
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
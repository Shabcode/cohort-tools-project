const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 5005;
const mongoose = require("mongoose");



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

app.get("/api/cohorts", async (req, res) => {
  try {
    console.log("/api/cohorts route triggered!")
    const cohortsFromDB = await cohorts.find()
    console.log("cohorts from db:",cohortsFromDB
    )

    if(!cohortsFromDB.length){
      res.status(404).json({errorMessage: "Cohorts not found!"})
      return
    }
  return res.status(200).json({message: 'Api call successful!', cohortsFromDB})
  }
  catch(error){
    console.log("error occured while fetching cohorts:",error)
    res.status(500).json({errorMessage: "Internal server error!"})
  }
 });

app.get("/api/students", (req, res) => {
  res.json(students);
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
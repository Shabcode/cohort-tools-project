const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Student = require("./models/Student.model");

const { isAuthenticated } = require("./middleware/jwt.middleware");

router.post("/api/students", isAuthenticated, async (req, res, next) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        error.status = 400;
        next(error);
    }
});

// Retrieve all students
router.get("/api/students", isAuthenticated, async (req, res, next) => {
    try {
        const students = await Student.find().populate("cohort");
        res.json(students);
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

// Retrieve students for a cohort
router.get("/api/students/cohort/:cohortId", isAuthenticated, async (req, res, next) => {
    try {
        const students = await Student.find({ cohort: req.params.cohortId }).populate("cohort");
        res.json(students);
    } catch (error) {
        error.status = 500;
        next(error);
    }
});

// Retrieve a specific student by ID 
router.get("/api/students/:studentId", isAuthenticated, async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.studentId).populate("cohort");
        if (!student) {
            const error = new Error("Student not found");
            error.status = 404;
            throw error;
        }
        res.json(student);
    } catch (error) {
        if (!error.status) error.status = 500;
        next(error);
    }
});

// Update a specific student by ID 
router.put("/api/students/:studentId", isAuthenticated, async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true });
        if (!student) {
            const error = new Error("Student not found");
            error.status = 404;
            throw error;
        }
        res.json(student);
    } catch (error) {
        if (!error.status) error.status = 400;
        next(error);
    }
});

// Delete a specific student by ID 
router.delete("/api/students/:studentId", isAuthenticated, async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.studentId);
        if (!student) {
            const error = new Error("Student not found");
            error.status = 404;
            throw error;
        }
        res.status(204).send();
    } catch (error) {
        if (!error.status) error.status = 500;
        next(error);
    }
});

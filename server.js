const express = require("express");
const mongoose = require("mongoose");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(express.json());

// Serve frontend files from public folder
app.use(express.static("public"));


// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log(error));


// ===============================
// EXPERIMENT 3
// STUDENT CRUD OPERATIONS
// ===============================


// Student Schema

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});


// Student Model

const Student = mongoose.model("Student", studentSchema);


// CREATE STUDENT

app.post("/students", async (req, res) => {

  try {

    const student = new Student(req.body);

    await student.save();

    res.status(201).json({
      message: "Student added successfully",
      data: student
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// READ STUDENTS

app.get("/students", async (req, res) => {

  try {

    const students = await Student.find();

    res.status(200).json(students);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// UPDATE STUDENT

app.put("/students/:id", async (req, res) => {

  try {

    const student = await Student.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true }

    );


    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }


    res.status(200).json({

      message: "Student updated successfully",

      data: student

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// DELETE STUDENT

app.delete("/students/:id", async (req, res) => {

  try {

    const student = await Student.findByIdAndDelete(
      req.params.id
    );


    if (!student) {

      return res.status(404).json({
        message: "Student not found"
      });

    }


    res.status(200).json({
      message: "Student deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ===============================
// EXPERIMENT 4
// UNIVERSITY COURSE STRUCTURE
// ===============================


// COURSE SCHEMA

const courseSchema = new mongoose.Schema({

  courseName: String,

  duration: String,

  semesters: [

    {

      semesterName: String,

      subjects: [String]

    }

  ]

});


// COURSE MODEL

const Course = mongoose.model(
  "Course",
  courseSchema
);


// CREATE COURSE

app.post("/courses", async (req, res) => {

  try {

    const course = new Course(req.body);

    await course.save();


    res.status(201).json({

      message: "Course added successfully",

      data: course

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


// GET ALL COURSES
// Frontend will use this route

app.get("/courses", async (req, res) => {

  try {

    const courses = await Course.find();

    res.status(200).json(courses);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


// GET SINGLE COURSE

app.get("/courses/:id", async (req, res) => {

  try {

    const course = await Course.findById(
      req.params.id
    );


    if (!course) {

      return res.status(404).json({

        message: "Course not found"

      });

    }


    res.status(200).json(course);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


// UPDATE COURSE

app.put("/courses/:id", async (req, res) => {

  try {

    const course = await Course.findByIdAndUpdate(

      req.params.id,

      req.body,

      { new: true, runValidators: true }

    );


    if (!course) {

      return res.status(404).json({
        message: "Course not found"
      });

    }


    res.status(200).json({

      message: "Course updated successfully",

      data: course

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


// DELETE COURSE

app.delete("/courses/:id", async (req, res) => {

  try {

    const course = await Course.findByIdAndDelete(
      req.params.id
    );


    if (!course) {

      return res.status(404).json({
        message: "Course not found"
      });

    }


    res.status(200).json({
      message: "Course deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ===============================
// START SERVER
// ===============================

const PORT = 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
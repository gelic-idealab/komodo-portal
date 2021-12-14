const express = require("express");
const { getCourseList, getCourseListByInstructor, getCourseDetail, getAllCourses, createCourse, editCourse, editMultipleCourse, getAllSemesters, deleteCourse, getCourseAccess } = require("../service/course");
const courseController = express.Router();

// Query course list by user id
courseController.get("/users/:userId",
  async (req, res) => {
    const { userId } = req.params;
    const results = await getCourseList(userId);
    res.status(results.code || 200).json(results.data);
  });

  courseController.get("/instructors/:userId",
  async (req, res) => {
    const { userId } = req.params;
    const results = await getCourseListByInstructor(userId);
    res.status(results.code || 200).json(results.data);
  });

// Get semester list
courseController.get("/semester",
  async (req, res) => {
    const results = await getAllSemesters();
    res.status(results.code || 200).json(results.data);
  }
)

// Get course detail information by course id
courseController.get("/:courseId",
  async (req, res) => {
    const { courseId } = req.params;

    const results = await getCourseDetail(courseId);
    res.status(results.code || 200).json(results.data);
  });

// Get course list 
courseController.get("/",
  async (req, res) => {
    const results = await getAllCourses();
    res.status(results.code || 200).json(results.data);
  }
)

// Create new course
courseController.post("/",
  async (req, res) => {
    const {courseName, courseNo, credit, department, instructorId, semesterId, userList} = req.body;
    const results = await createCourse({courseName, courseNo, credit, department, instructorId, semesterId, userList});
    res.status(results.code || 200).json(results.data);
  }
)

// Edit course by course id
courseController.put("/edit",
  async (req, res) => {
    const {courseName, courseNo, credit, department, description, instructorId, semesterId, userList, courseId} = req.body;
    const results = await editCourse({courseName, courseNo, credit, department, description, instructorId, semesterId, userList, courseId});
    res.status(results.code || 200).json(results.data);
  }
)

// Edit multiple courses by their course id
courseController.put("/edit/multiple",
  async (req, res) => {
    const {courses, credit, department, description, instructorId, semesterId, userList} = req.body;
    const results = await editMultipleCourse({courses, credit, department, description, instructorId, semesterId, userList});
    res.status(results.code || 200).json(results.data);
  }
)

// Delete course by course id
courseController.delete("/delete",
  async (req, res) => {
    const {courseId} = req.body;
    const results = await deleteCourse({courseId});
    res.status(results.code || 200).json(results.data);
  }
);

//get access list of courses by course id
courseController.get("/permissions/:courseId",
  async (req, res) => {
    const { courseId } = req.params;
    const results = await getCourseAccess(courseId);
    res.status(results.code || 200).json(results.data);
  });

module.exports = courseController;

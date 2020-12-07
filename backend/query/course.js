const getCourseList = `
SELECT
  c.course_id, c.course_no, c.course_name, c.department, c.description,
  CONCAT(u.last_name, ', ', u.first_name) as instructor_name,
  CONCAT(s.period, ' ', s.year) as semester
FROM KP_Course c
JOIN KP_User u
  ON c.instructor_id = u.user_id
JOIN KP_Semester s
  ON c.semester_id = s.semester_id
WHERE c.course_id IN (SELECT r.course_id FROM KP_Registration r WHERE r.student_id = ?)
`;

const getCourseDetail = `
SELECT
  c.*,
  CONCAT(u.last_name, ', ', u.first_name) as instructor_name,
  CONCAT(s.period, ' ', s.year) as semester
FROM KP_Course c
JOIN KP_User u
  ON c.instructor_id = u.user_id
JOIN KP_Semester s
  ON c.semester_id = s.semester_id
WHERE course_id = ?
`;

const getAllCourses = `
SELECT
  c.course_id, c.course_no, c.course_name, c.department, c.description,
  CONCAT(u.last_name, ', ', u.first_name) as instructor_name,
  CONCAT(s.period, ' ', s.year) as semester
FROM KP_Course c
JOIN KP_User u
  ON c.instructor_id = u.user_id
JOIN KP_Semester s
  ON c.semester_id = s.semester_id
`

const registerCourse = `
INSERT INTO
  KP_Registration (student_id, course_id)
VALUES
`

const getRegisteredCourse = `
SELECT
  c.*
FROM komodo_portal.KP_Course c
JOIN komodo_portal.KP_Registration r
  ON c.course_id = r.course_id
WHERE r.student_id = ?;
`
const unregisterCourse = `
DELETE FROM KP_Registration
WHERE student_id = ?
`

const createCourse = `
INSERT INTO
  KP_Course (course_name, course_no, credit_hours, department, instructor_id, semester_id)
VALUES
  (?, ?, ?, ?, ?, ?)
`

const unregisterUser = `
DELETE FROM KP_Registration
WHERE course_id = ?
`

const editCourseQuery = `
UPDATE KP_Course
SET course_name = ?, course_no = ?, credit_hours = ?, department = ?, description = ?, instructor_Id = ?, semester_Id = ?
WHERE course_id = ?
`

const editMultipleCourses = `
UPDATE KP_Course
SET credit_hours = ?, department = ?, description = ?, instructor_Id = ?, semester_Id = ?
WHERE course_id = ?
`

const getSemestersQuery = `
SELECT semester_id, concat(period, " ", year) AS semester
FROM KP_Semester;
`

const deleteCourseQuery = `
DELETE FROM KP_Course 
WHERE course_id = ?;
`;
module.exports = {
  getCourseList,
  getCourseDetail,
  getAllCourses,
  registerCourse,
  getRegisteredCourse,
  unregisterCourse,
  createCourse,
  editCourseQuery,
  unregisterUser,
  editMultipleCourses,
  getSemestersQuery,
  deleteCourseQuery
};

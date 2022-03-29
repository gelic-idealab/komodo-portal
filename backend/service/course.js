const pool = require("./index");
const courseQuery = require("../query/course");
const userQuery = require("../query/user");

// Get course list by user id
const getCourseList = async userId => {
  const results = await pool.execute(courseQuery.getCourseList, [userId]);
  const courseList = results[0];

  return {
    data: courseList
  };
};

const getCourseListByInstructor = async userId => {
  const results = await pool.execute(courseQuery.getCourseListByInstructor, [userId]);
  const courseList = results[0];
  return { data: courseList };
};

// Get course detailed information by course id
const getCourseDetail = async courseId => {
  // Get course information
  const results = await pool.execute(courseQuery.getCourseDetail, [courseId]);
  const course = results[0][0];
  // Get registered user list for the course id
  const userResults = await pool.execute(userQuery.getRegisteredUser, [courseId]);
  const userList = userResults[0];

  return {
    data: {...course, userList}
  };
};

// Get all course list 
const getAllCourses = async () => {
  const results = await pool.execute(courseQuery.getAllCourses);
  return {
    data: results[0]
  };
};

// Create new course
const createCourse = async ({courseName, courseNo, credit, department, instructorId, semesterId, userList}) => {
  // Create course in the course table
  const createCourseResults = await pool.execute(
    courseQuery.createCourse,
    [courseName, courseNo, credit, department, instructorId, semesterId]
  );
  const courseId = createCourseResults[0].insertId;
  if (userList.length) {
    let values = "";
    for (const userId of userList) {
      values += `(${userId}, ${courseId}),`
    }
    // Add registration information
    await pool.execute(
      courseQuery.registerCourse + values.slice(0, values.length - 1)
    );
  }

  return {
    data: { courseId }
  }
}

// Edit course by course id
const editCourse = async({courseName, courseNo, credit, department, description, instructorId, semesterId, userList, courseId}) => {
  // Update course information
  const editCourseResults = await pool.execute(
    courseQuery.editCourseQuery, [courseName, courseNo, credit, department, description, instructorId, semesterId, courseId]
  );
  // Delete the previous registration information for the course id
  await pool.execute(
    courseQuery.unregisterUser,
    [courseId]
  );
  // Create new registration information for the course id
  let values = "";
  for (const userId of userList) {
    values += `(${userId}, ${courseId}),`
  }

  await pool.execute(
    courseQuery.registerCourse + values.slice(0, values.length - 1)
  );

  return {
    data: true
  };
}

// Edit multiple course by their course id
const editMultipleCourse = async({courses, credit, department, description, instructorId, semesterId, userList}) => {
  // Get the course id in the courses list, execute the edit query for the course id
  for(const courseId of courses){
    await pool.execute(courseQuery.editMultipleCourses, [credit, department, description, instructorId, semesterId, courseId]);
    // Remove the registration information for the course id
    await pool.execute(
      courseQuery.unregisterUser,[courseId]
    );
  };
  // Add new registration information for the course id
  if(userList.length){
    let values = "";
    for (const courseId of courses){
      for (const userId of userList) {
        values += `(${userId}, ${courseId}),`
      }
    }
    await pool.execute(
      courseQuery.registerCourse + values.slice(0, values.length - 1)
    );
  }
  return {
    data: true
  }
}

// Get all semester information
const getAllSemesters = async () => {
  const results = await pool.execute(courseQuery.getSemestersQuery);
  return {
    data: results[0]
  }
}

// Delete course by course id
const deleteCourse = async({courseId}) => {
  // Remove registration information by course id
  await pool.execute(
    courseQuery.unregisterUser,
    [courseId]
  );
  // Delete the course information
  await pool.execute(
    courseQuery.deleteCourseQuery, 
    [courseId]
  );
  return {
    data: true
  }
}

//get access list of courses by course id
const getCourseAccess = async courseId => {
  const accessResults = await pool.execute(courseQuery.getCourseAccessByCouseId, [courseId]);
  const accessList = accessResults[0];
  return {
    data: {accessList}
  };
};

module.exports = {
  getCourseList,
  getCourseListByInstructor,
  getCourseDetail,
  getAllCourses,
  createCourse,
  editCourse,
  editMultipleCourse,
  getAllSemesters,
  deleteCourse,
  getCourseAccess
};

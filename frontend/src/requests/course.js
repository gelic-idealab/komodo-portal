import baseRequest from "./base";

// Get course list by user id
export const getCourseList = userId => {
  return baseRequest.get(`/courses/users/${userId}`);
};

// Get instructor's course list by id
export const getCourseListByInstructor = userId => {
  return baseRequest.get(`/courses/instructors/${userId}`);
};

// Get course details by course id
export const getCourseDetail = params => {
  const { courseId } = params;
  return baseRequest.get(
    `/courses/${courseId}`
  );
};

// Get lab list
export const getLabList = params => {
  return baseRequest.get(
    "/labs",
    { params }
  );
};

// Get lab details by lab id
export const getLabDetail = params => {
  const { labId } = params;
  return baseRequest.get(
    `/labs/${labId}`
  );
};

// Create new lab
export const createLab = params => {
  return baseRequest.post(
    "/labs",
    params
  );
};

// Edit the lab by lab id
export const editLab = params => {
  return baseRequest.put(
    "/labs/edit",
    params
  );
}

// Delete the lab by lab id
export const deleteLab = params => {
  return baseRequest.delete(
    "/labs/delete",
    {
      data: params
    }
  );
}

// Get all course information
export const getAllCourses = () => {
  return baseRequest.get(
    "/courses"
  )
}

// Create new course
export const createCourse = params => {
  return baseRequest.post(
    "/courses",
    params
  )
}

// Edit the course by course id
export const editCourse = params => {
  return baseRequest.put(
    "/courses/edit",
    params
  );
};

// Edit multiple courses
export const editMultipleCourse = params => {
  return baseRequest.put(
    "/courses/edit/multiple",
    params
  );
};

// Get semester list
export const getSemesterList = () => {
  return baseRequest.get(
    "/courses/semester"
  );
};

// Delete the course by course id
export const deleteCourse = params => {
  return baseRequest.delete(
    "/courses/delete",
    {
      data: params
    }
  );
}

// Get list of captures by course id
export const getCaptures = params => {
  return baseRequest.get(
    "/labs/captures",
    { params }
  );
}

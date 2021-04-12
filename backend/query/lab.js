const getLabList = `
SELECT *
FROM KP_Lab
WHERE course_id = ?
`;

const getLabDetail = `
SELECT *
FROM KP_Lab
WHERE session_id = ?
`;

const createLab = `
INSERT INTO
  KP_Lab (session_name, course_id, description, create_at, start_time, end_time, build)
VALUES
  (?, ?, ?, ?, ?, ?, ?)
`;

const editLabQuery = `
UPDATE KP_Lab
SET session_name = ?, description = ?, start_time = ?, end_time = ?, build = ?
WHERE session_id = ?;
`;

const getLabUsers = `
SELECT DISTINCT r.student_id, u.email, u.first_name, u.last_name
FROM KP_Registration r
JOIN KP_User u ON r.student_id = u.user_id
WHERE r.course_id = (SELECT course_id FROM KP_Lab WHERE session_id = ?)
`;

const deleteLabQuery = `
DELETE FROM KP_Lab 
WHERE session_id = ?;
`;

const capturesQuery = `
SELECT *
FROM captures
WHERE session_id = ?;
`

module.exports = {
  getLabList,
  getLabDetail,
  createLab,
  editLabQuery,
  getLabUsers,
  deleteLabQuery,
  capturesQuery
};

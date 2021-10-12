const login = `
SELECT u.user_id, u.email, u.first_name, u.last_name,
       u.last_login_at, r.role_name
FROM KP_User u
JOIN KP_Role r
  ON u.role_id = r.role_id
WHERE email = ?
  AND password = ?;
`;

const resetUser = `
UPDATE KP_User
SET
    first_name = ?, last_name = ?, email = ?, password = ?
WHERE
    user_id = ?;
`;

const findUser = `
SELECT u.user_id, u.email, u.first_name, u.last_name,
       u.last_login_at, r.role_name
FROM KP_User u
JOIN KP_Role r
  ON u.role_id = r.role_id
WHERE u.user_id = ?;
`

const getUserList = `
SELECT u.user_id, u.email, CONCAT(u.first_name, ' ', u.last_name) AS user_name,
       r.role_name
FROM KP_User u
JOIN KP_Role r
  ON u.role_id = r.role_id;
`

const createUser = `
INSERT INTO
  KP_User (email, password, first_name, last_name, role_id, last_login_at)
VALUES
  (?, ?, ?, ?, ?, ?)
`

const getUserDetail = `
SELECT u.user_id, u.email, u.first_name, u.last_name,
       r.role_id
FROM KP_User u
JOIN KP_Role r
  ON u.role_id = r.role_id
WHERE u.user_id = ?;
`

const editUserQuery = `
UPDATE KP_User
SET last_name = ?, first_name = ?, email = ?, role_id = ?
WHERE user_id = ?;
`

const updatePassword = `
UPDATE KP_User
SET password = ?
WHERE user_id = ?;
`

const editMultipleUsers = `
UPDATE KP_User
SET role_id = ?
WHERE user_id = ?;
`

const getUserListByCourse = `
SELECT u.user_id, CONCAT(u.last_name, ', ', u.first_name) as user_name
FROM KP_Course c
JOIN KP_Registration r
ON c.course_id = r.course_id
JOIN KP_User u
ON r.student_id = u.user_id
WHERE c.course_id = ?;
`

const getRegisteredUser = `
SELECT
  u.*
FROM KP_User u
JOIN KP_Registration r
  ON u.user_id = r.student_id
WHERE r.course_id = ?;
`

const deleteUserQuery = `
DELETE FROM KP_User
WHERE user_id = ?;
`;
module.exports = {
  login,
  resetUser,
  findUser,
  getUserList,
  createUser,
  getUserDetail,
  editUserQuery,
  editMultipleUsers,
  getUserListByCourse,
  getRegisteredUser,
  updatePassword,
  deleteUserQuery
};

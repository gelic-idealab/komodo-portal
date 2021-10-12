const pool = require("./index");
const userQuery = require("../query/user");
const courseQuery = require("../query/course");
const assetQuery = require("../query/asset");

/**
 * User Login
 * @param {string} email
 * @param {string} password
 */
const login = async (email, password) => {
  const results = await pool.execute(userQuery.login, [email, password]);
  const users = results[0];

  if (!users.length) {
    return {
      code: 401,
      data: { message: "Incorrect login information." }
    }
  }

  return {
    code: 200,
    data: { user: users[0] }
  }
};

/**
 * Reset password
 * @param {integer} user_id
 * @param {string} password
 */
const resetUser = async (user_id, firstName, lastName, email, password) => {
  const results = await pool.execute(userQuery.resetUser, [firstName, lastName, email, password, user_id]);
  const success = results[0];
  if (!success.changedRows) {
    return {
      code: 401,
      data: { success: false, message: "Error updating password." }
    }
  }
  return {
    code: 200,
    data: { success: true }
  }
}

/**
 * Get user information by user id
 * @param {integer} user_id 
 */
const findUser = async(user_id) => {
  const results = await pool.execute(userQuery.findUser, [user_id]);
  const users = results[0];
  if (!users.length) {
    return {
      code: 401,
      data: { message: "User doesn't exist." }
    }
  }
  return {
    code: 200,
    data: { user: users[0] }
  }
}

/**
 * Get user list
 */
const getUserList = async() => {
  const results = await pool.execute(
    userQuery.getUserList
  );
  const userList = results[0];

  return {
    data: userList
  }
}

/**
 * Create user
 * @param {string} lastName
 * @param {string} firstName
 * @param {string} email
 * @param {integer} roleId
 * @param {string} password
 * @param {Array} courseList   
 */
const createUser = async ({ lastName, firstName, email, roleId, password, courseList }) => {
  // Set the current time as a login time
  const loginTime = new Date();
  // Create user
  const createUserResults = await pool.execute(
    userQuery.createUser,
    [email, password, lastName, firstName, roleId, loginTime]
  );
  const userId = createUserResults[0].insertId;
  // Register user for the selected courses
  if (courseList.length) {
    let values = "";
    for (const courseId of courseList) {
      values += `(${userId}, ${courseId}),`
    }
    await pool.execute(
      courseQuery.registerCourse + values.slice(0, values.length - 1)
    );
  }

  return {
    data: { userId }
  }
};

/**
 * Get user detailed information by user id
 * @param {integer} userId 
 */
const getUserDetail = async userId => {
  const results = await pool.execute(userQuery.getUserDetail, [userId]);
  const user = results[0][0];
  const courseResults = await pool.execute(courseQuery.getRegisteredCourse, [userId]);
  const courseList = courseResults[0];

  return {
    data: {...user, courseList}
  }
}

/**
 * Get user detailed information and assets by user id
 * @param {integer} userId 
 */
 const getUserDetailWithAssets = async userId => {
  const results = await pool.execute(userQuery.getUserDetail, [userId]);
  const user = results[0][0];
  const assetResults = await pool.execute(assetQuery.getUserAssetList, [userId]);
  const assetList = assetResults[0];

  return {
    data: {...user, assetList}
  }
}

/**
 * Edit user by user id
 * @param {string} lastName
 * @param {string} firstName
 * @param {string} email
 * @param {integer} roleId
 * @param {string} password
 * @param {Array} courseList
 * @param {integer} userId   
 */
const editUser = async ({ lastName, firstName, email, password, roleId, courseList, userId }) => {
  // Edit user information
  await pool.execute(
    userQuery.editUserQuery, [lastName, firstName, email, roleId, userId]
  );
  // If the password was updated, updated the current password
  if(password !== "********"){
    await pool.execute(
      userQuery.updatePassword, [password, userId]
    );
  }
  // Remove previous registered courses for the user
  await pool.execute(
    courseQuery.unregisterCourse,
    [userId]
  );
  // Add new registered courses for the user
  if(courseList.length){
    let values = "";
    for (const courseId of courseList) {
      values += `(${userId}, ${courseId}),`
    }
    await pool.execute(
      courseQuery.registerCourse + values.slice(0, values.length - 1)
    );
  }
  return {
    data: true
  };
}

/**
 * Edit multiple users
 * @param {Array} users
 * @param {string} password
 * @param {integer} roleId
 * @param {Array} courseList 
 */
const editMultipleUsers = async({users, password, roleId, courseList}) => {
  // Get the user id in users list and update their information
  for(const userId of users){
    await pool.execute(userQuery.editMultipleUsers, [roleId, userId]);
    // Update their password if the current password was changed
    if(password !== "********"){
      await pool.execute(
        userQuery.updatePassword, [password, userId]
      );
    }
    // Remove the previous registered course for the user
    await pool.execute(
      courseQuery.unregisterCourse,[userId]
    );
  };
  // Add new registered course for all users in users list 
  if(courseList.length){
    let values = "";
    for (const userId of users){
      for (const courseId of courseList) {
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

/**
 * Query user list by course id
 * @param {integer} courseId 
 */
const getUserListByCourse = async courseId => {
  const results = await pool.execute(userQuery.getUserListByCourse, [courseId]);
  const userList = results[0];

  return {
    data: userList
  };
}

/**
 * Delete user with user id
 * @param {integer} userId
 */
const deleteUser = async({userId}) => {
  await pool.execute(
    courseQuery.unregisterCourse,
    [userId]
  );
  await pool.execute(
    userQuery.deleteUserQuery, 
    [userId]
  );
  return {
    data: true
  }
}
module.exports = {
  login,
  resetUser,
  findUser,
  getUserList,
  createUser,
  getUserDetail,
  getUserDetailWithAssets,
  editUser,
  editMultipleUsers,
  getUserListByCourse,
  deleteUser
};

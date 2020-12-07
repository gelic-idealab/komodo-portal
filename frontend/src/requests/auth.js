import baseRequest from "./base";

// User login
export const login = params => {
  return baseRequest.post(
    "/users/login",
    params
  )
};

// Reset the password
export const resetPassword = params => {
  return baseRequest.post(
    "/userspassword",
    params
  )
}

// User logout
export const logout = () => {
  return baseRequest.get(
    "/users/logout"
  )
}


// Check whether the user has a valid login cookies
export const initial = () => {
  return baseRequest.get(
    "/users/initial"
  )
}

// Get user list
export const getUserList = () => {
  return baseRequest.get(
    "/users"
  );
};

// Create a new user
export const createUser = params => {
  return baseRequest.post(
    "/users",
    params
  );
};

// Edit the user by user id
export const editUser = params => {
  return baseRequest.put(
    "/users/edit",
    params
  );
};

// Get the user details by user id
export const getUserDetail = params => {
  const { userId } = params;
  return baseRequest.get(
    `/users/detail/${userId}`
  )
};

// Edit multiple users
export const editMultipleUsers = params => {
  return baseRequest.put(
    "/users/edit/multiple",
    params
  );
};

// Get user list for the specific course by course id
export const getUserListByCourse = courseId => {
  return baseRequest.get(
    `/users/${courseId}`
  )
};

// Delete the user by user id
export const deleteUser = params => {
  return baseRequest.delete(
    "/users/delete",
    {
      data: params
    }
  );
}
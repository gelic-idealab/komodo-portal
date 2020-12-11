const express = require("express");
const { login, resetPassword, findUser, getUserList, createUser, getUserDetail, editUser, editMultipleUsers, getUserListByCourse, deleteUser } = require("../service/user");
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const userController = express.Router();
const config = require('../config');

// Check whether the user has the valid token to login
userController.get("/initial",
  async (req, res) => {
    // Get token from the cookies
    let token = req.cookies.jwt;
    if (token) {
      // If the token exists and is valid, return the user information directly
      // Return the error message in the other case
      const decode = jwt.verify(token, config.jwt);
      const results = await findUser(decode.id);
      if (results.data) {
        res.status(results.code || 200).json(results.data);
        return;
      } else {
        res.status(401).end();
        return;
      }
    } else {
      res.status(401).end();
      return;
    }
  }
)

// User login
userController.post("/login",
  async (req, res) => {
    const {email, password} = req.body;
    // If the login information is not valid, return error message
    if (!email.length || !password.length) {
      res.status(400).send({message: "Missing parameters."});
      return;
    }
    // Do the login process and return the user id
    const results = await login(email, password);
    const id = results.data.user.user_id;
    // Generate a new token for the login user 
    const token = await promisify(jwt.sign)({id}, config.jwt,
    {
      expiresIn: 7 * 24 * 60 * 60 * 1000
    }
    );
    // Store the token in the cookie
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
      httpOnly: false,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });
    res.status(results.code || 200).json(results.data);
  }
  );

// Reset the password by user id and new password
userController.post("/password",
  async (req, res) => {
    const {user_id, password} = req.body;
    if (!user_id || !password.length) {
      res.status(400).send({message: "Invalid user or password."});
      return;
    }
    // Reset the previous cookies for user
    if(req.cookies.jwt) {
      res.clearCookie('jwt');
    }
    const results = await resetPassword(user_id, password);
    res.status(results.code || 200).json(results.data);
  })

// User logout
userController.get("/logout",
  async (req, res) => {
    // If there exists cookies, clear previous cookes for the user
    if (req.cookies.jwt) {
      res.clearCookie('jwt');
      res.status(200).json({
        status: 'success'
      })
      return;
    } else {
      res.status(200).json({
        status: 'success'
      });
    }
  }
)

// Get user list 
userController.get("/",
  async (req, res) => {
    const results = await getUserList();
    res.status(200).json(results.data);
  });

// Create new user
userController.post("/",
  async (req, res) => {
    const { lastName, firstName, email, roleId, password, courseList } = req.body;

    const results = await createUser({
      lastName,
      firstName,
      email,
      roleId,
      password,
      courseList
    });
    res.status(results.code || 200).json(results.data);
});

// Query user detailed information by user id
userController.get("/detail/:userId",
  async (req, res) => {
    const {userId} = req.params;
    const results = await getUserDetail(userId);
    res.status(results.code || 200).json(results.data);
  }
)

// Edit user information by user id
userController.put("/edit", 
  async (req, res) => {
    const { lastName, firstName, email, password, roleId, courseList, userId } = req.body;
    const results = await editUser({lastName, firstName, email, password, roleId, courseList, userId});
    res.status(results.code || 200).json(results.data);
});

// Edit multiple users by their user id
userController.put("/edit/multiple",
  async (req, res) => {
    const {users, password, roleId, courseList} = req.body;
    const results = await editMultipleUsers({users, password, roleId, courseList});
    res.status(results.code || 200).json(results.data);
  }
)

// Query registered user list by course id
userController.get("/:courseId",
  async (req, res) => {
    const{courseId} = req.params;
    const results = await getUserListByCourse(courseId);
    res.status(results.code || 200).json(results.data);
  }
)

// Delete user by user id
userController.delete("/delete",
  async (req, res) => {
    const {userId} = req.body;
    const results = await deleteUser({userId});
    res.status(results.code || 200).json(results.data);
  }
);
module.exports = userController;

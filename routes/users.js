const { Router } = require('express');

const { authenticated } = require('../middleware/auth');
const userController = require('../controller/userController');

const router = Router();

// @Desc  Login Page
// @Desc  GET /users/login
router.get("/login",userController.login);

// @Desc  Login Handle
// @Desc  POST /users/login
router.post("/login",userController.loginHandle,userController.rememberMe);

// @Desc  Logout Handle
// @Desc  GET /users/logoin
router.get("/logout",userController.logout);

// @Desc  Register Page
// @Desc  GET /users/register
router.get("/register",userController.register);

// @Desc  Forget Password Page
// @Desc  GET /users/forget-password
router.get("/forget-password",userController.forgetPassword);

// @Desc  Reset Password Page
// @Desc  GET /users/reset-password/:token
router.get("/reset-password/:token",userController.resetPassword);

// @Desc  Handle Forget Password Page
// @Desc  POST /users/forget-password
router.post("/forget-password",userController.handleForgetPassword);

// @Desc  Handle Reset Password Page
// @Desc  POST /users/reset-password/:id
router.post("/reset-password",userController.handleResetPassword);

// @Desc  Register Page
// @Desc  POST /users/register
router.post("/register",userController.createUser);

module.exports = router;
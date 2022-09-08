const { Router } = require('express');

const { authenticated } = require('../middleware/auth');
const userController = require('../controller/userController');

const router = Router();

// @Desc  Login Page
// @Desc  GET /users/login
router.get("/login",userController.login);

// @Desc  Login Handle
// @Desc  POST /users/login
router.post("/login",userController.loginHandle);

// @Desc  Logout Handle
// @Desc  GET /users/logoin
router.get("/logout",userController.logout);

// @Desc  Register Page
// @Desc  GET /users/register
router.get("/register",userController.register);

// @Desc  Register Page
// @Desc  POST /users/register
router.post("/register",userController.createUser);

module.exports = router;
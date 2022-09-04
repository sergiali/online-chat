const { Router } = require('express');

const router = Router();

// @Desc  Login Page
// @Desc  GET /users/login
router.get("/login",(req,res) => {
    res.render("login",{pageTitle : " ورود به صفحه چت " ,
    path : "/login"
});
});

// @Desc  Register Page
// @Desc  GET /users/register
router.get("/register",(req,res) => {
    res.render("register",{pageTitle : " ثبت نام کاربر " ,
    path : "/register"
});
});

// @Desc  Register Page
// @Desc  POST /users/register
router.post("/register",(req,res) => {
    console.log(req.body);
    res.send("weblog");
});

module.exports = router;
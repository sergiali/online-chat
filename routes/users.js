const { Router } = require('express');
const validate = require('fastest-validator');

const router = Router();
const v = new validate();

const schema = {
    fullname: {
        type: "string",
        trim: true,
        min: 4,
        max: 255,
        optional: false,
        messages: {
            required: "نام و نام خانوادگی الزامی می باشد",
            stringMin: "نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد",
            stringMax: "نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد",
        },
    },

    email: {
        type: "email",
        normalize: true,
        messages: {
            emailEmpty: "فیلد ایمیل نباید خالی باشد",
            required: "ایمیل الزامی می باشد",
            string: "آدرس ایمیل را بررسی کنید",
        },
    },

    password: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "کلمه عبور الزامی می باشد",
            string: "کلمه عبور را بررسی کنید",
            stringMin: "کلمه عبور نباید کمتر از 4 کاراکتر باشد",
            stringMax: "کلمه عبور نمی تواند بیشتر از 255 کاراکتر باشد",
        },
    },

    confirmPassword: {
        type: "string",
        min: 4,
        max: 255,
        messages: {
            required: "تکرار کلمه عبور الزامی می باشد",
            string: "تکرار کلمه عبور را بررسی کنید",
            stringMin: "تکرار کلمه عبور نباید کمتر از 4 کاراکتر باشد",
            stringMax: "تکرار کلمه عبور نباید بیشتر از 255 کاراکتر باشد",
        },
    },
    $$strict: true,
};

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
    const validatee = v.validate(req.body,schema);
    const errorArr = [];
    if(validatee === true)
    {
        const {fullname,email,confirmPassword,password} = req.body;
        console.log(fullname);
        console.log(req.body);
        if(confirmPassword !== password ){
            errorArr.push({message:"کلمه های عبور یکسان نیستند"});

            return res.render("register",{
                pageTitle: " ثبت نام کابر ",
                path: "/register",
                errors: errorArr,
            });
        };
        res.redirect("/users/login");
    } else {
        console.log(validatee);
        res.render("register",{
            pageTitle: " ثبت نام کاربر ",
            path: "/register",
            errors: validatee,
        });
    } ;

});

module.exports = router;
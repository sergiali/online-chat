const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../model/user');

exports.login = (req,res) => {
    res.render("login",{
        pageTitle: " ورود به چت ",
        path: "/login",
        message: req.flash("success-msg"),
        error: req.flash("error"),
    });
};

exports.loginHandle = (req,res,next) => {
    passport.authenticate("local",{
        successRedirect:"/chat.html",
        failureRedirect:"/users/login",
        failureFlash: true,
    })(req,res,next);
};

exports.logout = (req,res,next) => {
    req.logout(function(err) {
        if(err) {
            return next(err);
        }
    });
    req.flash("success-msg","خروج موفقیت آمیز بود");
    res.redirect("/users/login");
};

exports.register = (req,res) => {
    res.render("register",{
        pageTitle:"ثبت نام کاربر جدید",
        path:"/register",
    });
};

exports.createUser = async (req,res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;
        const user = await User.findOne({email});
        if(user){
            errors.push({message:"کاربری با این ایمیل موجود می باشد"});
            return res.render("register",{
                pageTitle:"ثبت نام کاربر",
                path:"/register",
                errors,
            });
        }

        const hash = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            password:hash,
        });
        req.flash("success-msg","ثبت نام با موفقیت انجام شد");
        res.redirect("/users/login");
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });

        return res.render("register",{
            pageTitle: "ثبت نام کاربر",
            path: "/register",
            errors,
        });
    };
};
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../model/user');
const { sendEmail } = require('../utils/mailer');

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
        //successRedirect:"/chatt",
        failureRedirect:"/users/login",
        failureFlash: true,
    })(req,res,next);
};

exports.rememberMe = (req,res) => {
    if(req.body.remember){
        req.session.cookie.originalMaxAge= 24*60*60*1000;
    } else {
        req.session.cookie.expire = null;
    };
    res.redirect("/chatt");
}

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

        // const hash = await bcrypt.hash(password,10);
        // await User.create({
        //     fullname,
        //     email,
        //     password:hash,
        // });
        await User.create({
            fullname,
            email,
            password,
        });

        //? Send Wellcom Email
        sendEmail(
            email,
            fullname,
            " اپلیکیشن چت ",
            " خوش آمدی و اینجا میتونی با دوستات چت کنی و لذت ببری "
            );

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

exports.forgetPassword = async (req,res) => {
    res.render("forgetPass",{
        pageTitle: " فراموشی رمز عبور ",
        path: "/login",
        message: req.flash("success-msg"),
        error: req.flash("error"),
    });
};

exports.handleForgetPassword = async (req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        req.flash("error","کاربری با این ایمیل در پایگاه داده ثبت نیست");

        return res.render("forgetPass",{
            pageTitle: " فراموشی رمز عبور ",
            path: "/login",
            message: req.flash("success-msg"),
            error: req.flash("error"),
        });
    };

    const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    sendEmail(
        user.email,
        user.fullname,
        "فراموشی رمز عبور",
        `
        جهت تغییر رمز عبور روی لینک زیر کلیک کنید
        <a href=" ${resetLink}">  لینک تغییر رمز عبور</a>
    `);
    req.flash("success-msg","ایمیل حاوی لینک با موفقیت ارسال شد");

    res.render("forgetPass",{
        pageTitle: " فراموشی رمز عبور ",
        path: "/login",
        message: req.flash("success-msg"),
        error: req.flash("error"),
    });
};

exports.resetPassword = (req,res) => {
    const token = req.params.token;

    let decodedToken;
    try {
        decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodedToken);
    } catch (err) {
        console.log(err);
        if(!decodedToken){
            return res.redirect("/404");
        };
    };
        res.render("resetPass",{
            pageTitle:" تغییر رمز عبور ",
            path: "/login",
            message: req.flash("success-msg"),
            error: req.flash("error"),
            userId:decodedToken.userId,
        });
};

exports.handleResetPassword = async (req,res) => {
    const {password,confirmPassword} = req.body;
    if(password !== confirmPassword)
    {
        req.flash("error","کلمه های عبور یکسان نیستند");

        return res.render("resetPass",{
            pageTitle:" تغییر رمز عبور ",
            path: "/login",
            message: req.flash("success-msg"),
            error: req.flash("error"),
            userId:req.params.id,
        });
    };

    const user = await User.findOne({_id: req.params.id});
    if(!user){
        return res.redirect("/404")
    }
    user.password = password;
    await user.save();

    req.flash("success-msg","کلمه عبور شما با موفقیت تغییر یافت");
    res.redirect("/users/login");
};
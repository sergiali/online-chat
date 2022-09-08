const Yup = require('yup');

//? Yup
exports.schema = Yup.object().shape({
    fullname: Yup.string()
        .required("نام و نام خانوادگی الزامی میباشد")
        .min(4," نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد")
        .max(255,"نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    email: Yup.string()
        .email("ایمیل معتبر نمیباشد")
        .required("ایمیل الزامی میباشد"),
    password: Yup.string()
        .required("کلمه عبور الزامی میباشد")
        .min(4,"کلمه عبور نباید کمتر از 4 کاراکتر باشد")
        .max(255,"کلمه عبور نباید بیشتر از 255 کاراکتر باشد"),
    confirmPassword: Yup.string()
        .required(" تکرار کلمه عبور الزامی میباشد")
        .oneOf([Yup.ref("password"),null]," کلمه های عبور یکسان نیستند ")
});
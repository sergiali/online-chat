const { Router } = require('express');

//const {authenticated} = require('../middlewares/auth');

const router = new Router();

// @Desc   Dashboard
// @Route  GET /dashboard
router.get('/',(req,res) => {
    res.render("chat", {
    pageTitle:" اپلیکیشن چت آنلاین ", 
    path:"/chat",
    fullname: req.user.fullname,
});
});



module.exports = router;
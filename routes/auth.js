const auth          = require("../controllers/auth"),
      express       = require('express'),
      isAuth        = require('../controllers/authMiddlewares').isAuth,
      isAdmin       = require('../controllers/authMiddlewares').isAdmin,
      passport      = require('passport'),
      router        = express.Router(),
      validPassword = require('../controllers/passportUtils').validPassword;


//LOGIN
router.get("/", auth.loginGet);
router.post("/", passport.authenticate('local', { failureRedirect: '/', successRedirect: '/home' }));


//REGISTER
router.get("/register",isAdmin, auth.registerGet);
router.post("/register",isAdmin,auth.registerPost);


//LOGOUT
router.get("/logout", function (req, res) {
    req.logout();
    console.log("Logout Success");
    console.log(req.user);
    res.redirect("/");
});


module.exports = router;
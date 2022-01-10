const express        = require('express'),
      isAuth         = require('../controllers/authMiddlewares').isAuth,
      isAdmin        = require('../controllers/authMiddlewares').isAdmin,
      methodOverride = require("method-override"),
      router         = express.Router();

var Job  = require("../models/job"),
	Question = require("../models/question"),
	User = require("../models/user");


//USER PAGE SHOW ROUTE
router.get("/users/:id", isAuth, function (req, res) {
	User.findById(req.params.id).populate("appliedJobs").exec(function (err, foundUser) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.render("users/show", { user: foundUser });
		}
	});
});


//USER PAGE EDIT ROUTE
router.get("/users/:id/edit", isAuth, checkUser, function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.render("users/edit", { user: foundUser });
		}
	});
});


//USER PAGE UPDATE ROUTE
router.put("/users/:id", isAuth, checkUser, function (req, res) {
	User.findOneAndUpdate({_id: req.params.id},{$set:
	{
		personal_email: req.body.personal_email,
		 mobile_number: req.body.mobile_number,
		 resume_link: req.body.resume_link,
		 documents_link: req.body.documents_link
	}}, function (err, updatedUser) {
		if (err) {
			console.log(err);
			//res.redirect("/jobs");
		}
		else {
			res.redirect("/users/" + req.params.id);
		}
	});

});

//MIDDLEWARE
function checkUser(req,res,next){
	User.findById(req.params.id, function(err,foundUser){
		if(err){
			res.redirect("back");
		} else {
			if(foundUser._id.equals(req.user._id) || req.user.admin){
				next();
			} else {
				res.redirect("back");
			}
		}
	});
}


module.exports = router;
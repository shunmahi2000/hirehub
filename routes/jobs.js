const express = require('express'),
	isAuth = require('../controllers/authMiddlewares').isAuth,
	isAdmin = require('../controllers/authMiddlewares').isAdmin,
	methodOverride = require("method-override"),
	router = express.Router();

var Job = require("../models/job"),
	User = require("../models/user");


//LANDING PAGE
// router.get("/", function (req, res) {
// 	res.render("landing");
// })


//JOB INDEX ROUTE
router.get("/jobs", isAuth, function (req, res) {
	Job.find({}, function (err, jobs) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("jobs/index", { jobs: jobs });
		}
	});
});


//JOB NEW FORM ROUTE
router.get("/jobs/new", isAdmin, function (req, res) {
	res.render("jobs/new");
});


//JOB CREATE ROUTE
router.post("/jobs", isAdmin, function (req, res) {
	Job.create(req.body.job, function (err, newJob) {
		console.log(req.body.job);
		if (err) {
			console.log(err);
			res.render("jobs/new");
		}
		else {
			res.redirect("/jobs");
			console.log(newJob);
		}
	});
});


//JOB SHOW ROUTE
router.get("/jobs/:id", isAuth, function (req, res) {
	Job.findById(req.params.id).populate("students").exec(function (err, foundJob) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.render("jobs/show", { job: foundJob });
		}
	});
});


//JOB EDIT PAGE ROUTE
router.get("/jobs/:id/edit", isAdmin, function (req, res) {
	Job.findById(req.params.id, function (err, foundJob) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.render("jobs/edit", { job: foundJob });
		}
	});
});


//JOB UPDATE ROUTE
router.put("/jobs/:id", isAdmin, function (req, res) {
	Job.findByIdAndUpdate(req.params.id, req.body.job, function (err, updatedJob) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.redirect("/jobs/" + req.params.id);
		}
	});
});


//JOB DELETE ROUTE
router.delete("/jobs/:id", isAdmin, function (req, res) {
	Job.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/jobs");
		}
		else {
			res.redirect("/jobs");
		}
	});
});

//USER APPLY FOR JOB ROUTE
router.get("/jobs/:id/apply/:userID", isAuth, function (req, res) {
	User.findById(req.params.userID, function (err, student) {
		if (err) {
			console.log(err);
		} else {
			//console.log("a user was found " + student);
			Job.findById(req.params.id, function (err, foundJob) {
				if (err) {
					console.log(err);
				} else {
					var flag = 0;
					//eval(require("locus"));
					if (req.user.cgpa < foundJob.eligibility) {
						flag = 2;
					}
					foundJob.students.forEach(function (registeredStudent) {
						//eval(require("locus"));
						//console.log("this is a registered student" + registeredStudent);
						if (registeredStudent._id.equals(student._id)) {
							//eval(require("locus"));
							//res.send("you can only apply once");
							flag = 1;
						}
					});
					//console.log("a job was found " + foundJob);
					if (flag === 0) {
						foundJob.students.push(student);
						var size = foundJob.students.length;
						foundJob.students[size - 1].name = student.name;
						foundJob.save();
						student.appliedJobs.push(foundJob);
						student.save();
						res.redirect("/jobs/:" + req.params.id);
					}
					else if (flag === 1) {
						return res.status(400).json({
							status: 'error',
							error: 'you can only apply once',
						});
					}
					else if (flag === 2) {
						return res.status(400).json({
							status: 'error',
							error: 'required criteria not met',
						});
					}
				}
			});
		}
	});
});


module.exports = router;

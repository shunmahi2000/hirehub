const express        = require('express'),
      isAuth         = require('../controllers/authMiddlewares').isAuth,
      isAdmin        = require('../controllers/authMiddlewares').isAdmin,
      methodOverride = require("method-override"),
      router         = express.Router();

var Job  = require("../models/job"),
	Question = require("../models/question"),
	User = require("../models/user");


//QUESTION NEW FORM ROUTE
router.get("/job/:id/questions/new", isAdmin, function (req, res) {
	Job.findById(req.params.id, function(err,job){
		if(err){
			console.log(err);
		} else {
			res.render("questions/new", {job: job});
		}
	});
});


//QUESTION CREATE ROUTE
router.post("/job/:id/questions", isAdmin, function(req,res){
	Question.create(req.body.question, function (err, newQues) {
		if (err) {
			console.log(err);
		}
		//push  to job
		else {
			Job.findById(req.params.id, function(err,foundJob){
				foundJob.questions.push(newQues);
				foundJob.save();
				
				res.redirect("/job/"+req.params.id+"/questions")
			});
		}
	});
});


//QUESTION SHOW ROUTE
router.get("/job/:id/questions", isAdmin, function (req, res) {
    Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
        if (err) {
            res.redirect("/jobs");
        }
        else {
            res.render("questions/show", { job: foundJob });
        }
    });
});


//QUESTION EDIT FORM ROUTE
router.get("/job/:id/questions/:questionId/edit", isAdmin, function (req, res) {
	Question.findById(req.params.questionId, function (err, foundQues) {
		if (err) {
			console.log(err);
		}
		else {
			res.render("questions/edit", { jobId: req.params.id, question: foundQues });
		}
	});
});


// QUESTION UPDATE ROUTE
router.put("/job/:id/questions/:questionId", isAdmin, function (req, res) {
	Question.findByIdAndUpdate(req.params.questionId, req.body.question, function (err, updatedQues) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/job/" + req.params.id + "/questions");
		}
	});
});


//QUESTION DELETE ROUTE
router.delete("/job/:id/questions/:questionId", isAdmin, function (req, res) {
	Question.findByIdAndRemove(req.params.questionId, function (err) {
		if (err) {
			console.log(err);
		}
		else {
			res.redirect("/job/" + req.params.id + "/questions");
		}
	});
});


//TEST FORM ROUTE
router.get("/job/:id/test/:userId", function(req, res){
	if(req.user.selected == true){
	return res.status(400).json({
		status: 'error',
		error: 'you are already selected for another job',
	});
	}

	Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
		if(err){
			console.log(err);
		} else {
			foundJob.students.forEach(function(student){
				if(student._id.equals(req.user._id)){
					if(student.shortlisted){
						return res.status(400).json({
							status: 'error',
							error: 'you are already shortlisted for this job',
						});
					}
					else if(student.rejected){
						return res.status(400).json({
							status: 'error',
							error: 'Sorry but you have been rejected for this job',
						});
					}
				}
			});
			User.findById(req.params.userId, function(err, user){
				if(err){
					console.log(err);
				} else {
					res.render("test", {user:user, job: foundJob});
				}
			});
		}
	});
});


//TEST FORM LOGIC
router.post("/job/:id/test/:userId", function(req,res){
	// eval(require("locus"));
	//req.body.option
	if(req.user.selected == true){
		return res.status(400).json({
			status: 'error',
			error: 'you can only apply once',
		});
	}
	Job.findById(req.params.id).populate("questions").exec(function (err, foundJob) {
		if(err){
			console.log(err);
		} else {
			let marks=0;
			let total= foundJob.questions.length*0.75;
			for(let i =0;i< foundJob.questions.length; i++){
				if(foundJob.questions[i].correctAns == req.body.option[i]){
					marks++;
				}
			}
			//eval(require("locus"));
			if(marks>=total){
				foundJob.students.forEach(function(student){
					if(student._id.equals(req.user._id)){
						student.shortlisted = true;
						foundJob.save();
						res.redirect("/jobs/" + req.params.id);
					}
				});
			} else {
				foundJob.students.forEach(function(student){
					if(student._id.equals(req.user._id)){
						student.rejected = true;
						foundJob.save();
						res.redirect("/jobs/" + req.params.id);
					}
				});
			}
		}
	});
});


module.exports = router;
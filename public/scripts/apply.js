alert("script connected");
// var User = require("models/user.js");
// var Job = require("models/job.js");
import Job from '../../models/job.js'
import User from '../../models/user.js'
function apply(obj,job){
	console.log("apply method called");
	//var student = new User(obj);
	User.findById(obj._id,function(err,student){
		if(err){
			console.log(err);
		} else {
			console.log("a user was found " + student);
			Job.findById(job._id, function(err,foundJob){
				if(err){
					console.log(err);
				} else {
					console.log("a job was found " + foundJob);
					foundJob.students.push(student);
					foundJob.save();
					console.log("a student is pushed into a job");
				}
			});
		}
	});
	
}

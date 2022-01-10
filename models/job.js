var mongoose = require("mongoose");


var jobSchema = new mongoose.Schema({

	name: String,

	logo: String,

	eligibility: Number,

	description: String,

	stipend: String,

	students: [
		{
			id: {
				type: mongoose.Schema.Types.ObjectID,
				ref: "User"
			},
			shortlisted: {
				type: Boolean,
				default: false
			},
			rejected: {
				type: Boolean, 
				default: false
			},
			name: String
		}
	],
	
	questions: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Question"
		}
	],

});


module.exports = mongoose.model("Job", jobSchema);
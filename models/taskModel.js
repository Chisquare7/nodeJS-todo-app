const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	task_title: { type: String },
	task_description: { type: String },
	task_state: {
		type: String,
		value: ["Pending", "Completed", "Deleted"],
		default: "Pending",
	},
	user_id: { type: String, ref: "users" },
});


const taskModel = mongoose.model("tasks", taskSchema);

module.exports = taskModel;

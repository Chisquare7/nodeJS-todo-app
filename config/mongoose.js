const mongoose = require("mongoose");
require("dotenv").config();

function databaseConnect() {
	mongoose.connect(process.env.DB_URL);

	mongoose.connection.on("connected", () => {
		console.log("Database connection successful");
	});

	mongoose.connection.on("error", (error) => {
		console.log("Database connection failed", error);
	});
}

module.exports = { databaseConnect };
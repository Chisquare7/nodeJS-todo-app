const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { databaseConnect } = require("./config/mongoose");
const { loginAuthenticator } = require("./globalAuthentication/authMiddleware");
const taskModel = require("./models/taskModel");
const userRoute = require("./users/userRoute");
const taskRoute = require("./tasks/taskRoute");
const logger = require("./config/winston");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

databaseConnect();

app.locals.appName = "Listify";

// app.use sections
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static("public"));
app.use("/users", userRoute);
app.use("/tasks", loginAuthenticator, taskRoute);

// app.set sections
app.set("view engine", "ejs");
app.set("views", "views");

//app.gets (gets request) sections
app.get("/", (req, res) => {
	res.status(200).render("home", {
		navs: ["Welcome", "Register", "Login"],
	});
});

app.get("/Welcome", (req, res) => {
	res.redirect("/");
});

app.get("/register", (req, res) => {
	return res.render("register", {
		navs: ["Welcome", "Login"],
	});
});

app.get("/login", (req, res) => {
	try {
		return res.render("login", {
			navs: ["Welcome", "Register"],
		});
	} catch (error) {
		res.render("404 Error Page");
	}
});

app.get("/sort", loginAuthenticator, async (req, res) => {
	const user_id = res.locals.user._id;
	const task_state = req.query.state;

	let taskDetails;

	if (task_state === "completed") {
		taskDetails = await taskModel.find({ user_id, task_state: "Completed" });
	} else if (task_state === "pending") {
		taskDetails = await taskModel.find({ user_id, task_state: "Pending" });
	} else {
		taskDetails = await taskModel.find({ user_id });
	}

	res.status(200).render("taskListBoard", {
		navs: ["Welcome", "Logout"],
		user: res.locals.user,
		taskDetails,
		date: new Date(),
	});
});


app.get("/taskListBoard", loginAuthenticator, async (req, res) => {
    const taskDetails = await taskModel.find({ user_id: res.locals.user._id });

	res.status(200).render("taskListBoard", {
		navs: ["Welcome", "Logout"],
		user: res.locals.user,
		taskDetails,
		date: new Date(),
	});
});

app.get("/logout", (req, res) => {
	res.clearCookie("jwt");
	res.redirect("/");
});

app.get("/existingAccount", (req, res) => {
	res.status(409).render("existingAccount", {
		navs: ["register", "login"],
	});
});

app.get("/404ErrorPage", (req, res) => {
	res.status(404).render("404ErrorPage", {
		navs: ["register", "login"],
	});
});

app.get("/wrongUserDetails", (req, res) => {
	res.status(422).render("wrongUserDetails", {
		navs: ["register", "login"],
	});
});

app.get("*", (req, res) => {
	logger.error("Route not found")
	return res.status(404).json({
		data: null,
		error: "Route not found"
	})
})

app.listen(PORT, () => {
	console.log(`server started running at: http://localhost:${PORT}`);
});

module.exports = app;

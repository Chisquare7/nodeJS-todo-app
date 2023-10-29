const express = require("express")
const cookieParser = require("cookie-parser")
const controller = require("./taskController");
const taskModel = require("../models/taskModel");


const taskRouter = express.Router()

taskRouter.use(cookieParser());

taskRouter.post("/create", async (req, res) => {

    const user = res.locals.user
    const response = await controller.taskCreator({
        task_title: req.body.task_title,
        task_description: req.body.task_description,
        task_state: "Pending",
        user_id: user._id
        
    });
    
    if (response.code === 200) {
        res.redirect("/taskListBoard");
    } else {
        res.redirect("/wrongUserDetails");
    }
})


taskRouter.post("/update/:id", controller.changeState)

taskRouter.post("/delete/:id", controller.deleteTask)

module.exports = taskRouter;
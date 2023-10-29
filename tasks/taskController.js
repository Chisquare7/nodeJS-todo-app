const taskModel = require("../models/taskModel")

const taskCreator = async ({ task_title, task_description, task_state, user_id }) => {
    const taskDetails = { task_title, task_description, task_state, user_id };

    if (!taskDetails) {
        return {
            message: "Oops! Invalid information inputted",
            code: 422
        }
    }

    const tasks = await taskModel.create({
        task_title: taskDetails.task_title,
        task_description: taskDetails.task_description,
        task_state: taskDetails.task_state,
        user_id:taskDetails.user_id
    })

    return {
        message: "Great! Task created successfully",
        code: 200,
        tasks
    }
}


const changeState = (req, res) => {
    const id = req.params.id
    const update = req.body

    taskModel.findByIdAndUpdate(id, update, { new: true })
        .then(newState => {
            res.redirect("/taskListBoard");
        }).catch(error => {
            console.log(error)
            res.status(500).send(error)
        })
}


const deleteTask = (req, res) => {
    const id = req.params.id

    taskModel.findByIdAndRemove(id)
        .then(newDelete => {
            res.redirect("/taskListBoard");
        }).catch(error => {
            console.log(error);
            res.status(500).send(error)
        })
}


module.exports = { taskCreator, changeState, deleteTask };
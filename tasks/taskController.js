const logger = require("../config/winston");
const taskModel = require("../models/taskModel")

const taskCreator = async ({ task_title, task_description, task_state, user_id }) => {
    const taskDetails = { task_title, task_description, task_state, user_id };

    try {
       if (!taskDetails) {
            logger.error("Invalid information inputted for task creation");
            return {
                message: "Oops! Invalid information inputted",
                code: 422,
            };
        }

        const tasks = await taskModel.create({
            task_title: taskDetails.task_title,
            task_description: taskDetails.task_description,
            task_state: taskDetails.task_state,
            user_id: taskDetails.user_id,
        });

        logger.info("Task created successfully: " + taskDetails.task_title);
        return {
            message: "Great! Task created successfully",
            code: 200,
            tasks,
        }; 
    } catch (error) {
        logger.error(`Error creating task: ${error}`)
        console.error(error);
        return {
            message: "Internal server error",
            code: 500,
        }
    }
}


const changeState = (req, res) => {
    const id = req.params.id
    const update = req.body

    taskModel.findByIdAndUpdate(id, update, { new: true })
        .then(newState => {
            logger.info(`Task state changed for task with ID ${id}: ${update.task_state}`)
            res.redirect("/taskListBoard");
        }).catch(error => {
            logger.error(`Error changing task state: ${error}`)
            console.log(error)
            res.status(500).send(error)
        })
}


const deleteTask = (req, res) => {
    const id = req.params.id

    taskModel.findByIdAndRemove(id)
        .then(newDelete => {
            logger.info(`Task deleted with ID ${id}`);
            res.redirect("/taskListBoard");
        }).catch(error => {
            logger.error(`Error deleting task: ${error}`);
            console.log(error);
            res.status(500).send(error)
        })
}


module.exports = { taskCreator, changeState, deleteTask };
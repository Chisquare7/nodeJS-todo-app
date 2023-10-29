const express = require("express")
const middleware = require("./userMiddleware")
const controller = require("./userController")
const cookieParser = require("cookie-parser")

const userRouter = express.Router()

userRouter.use(cookieParser())

userRouter.post("/register", middleware.userValidator, async (req, res) => {
    const response = await controller.createUser({
        username: req.body.username,
        password: req.body.password
    })

    if (response.code === 200) {
        res.redirect("/login")
    } else {
        res.redirect("/existingAccount")
    }
})



userRouter.post("/login", middleware.userValidator, async (req, res) => {
    const response = await controller.loginUser({
        username: req.body.username,
        password: req.body.password
    })

    if (response.code === 200) {
        res.cookie("jwt", response.token, { maxAge: 60 * 60 * 1000 })
        res.redirect("/taskListBoard")
    } else if (response.code === 404) {
        res.redirect("/404ErrorPage")
    } else {
        res.redirect("/wrongUserDetails")
    }
});


module.exports = userRouter
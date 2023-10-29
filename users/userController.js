const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const createUser = async ({ username, password }) => {
    const userDetails = { username, password }
    
    const existingUser = await userModel.findOne({
        username: userDetails.username
    })

    if (existingUser) {
        return {
            message: "Oops! User already exist",
            code: 409
        }
    }

    const newUser = await userModel.create({
        username: userDetails.username,
        password: userDetails.password
    })

    return {
        message: "Account created successfully",
        code: 200,
        newUser
    }
}


const loginUser = async ({ username, password }) => {
    const loginDetails = { username, password }
    
    const user = await userModel.findOne({ username: loginDetails.username })
    
    if (!user) {
        return {
            code: 404,
            message: "Oops! User account not found"
        }
    }

    const validPassword = await user.isValidPassword(loginDetails.password)

    if (!validPassword) {
        return {
            code: 422,
            message: "Invalid credential. Username or Password is incorrect"
        }
    }

    const token = await jwt.sign({ _id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" })
    
    return {
        message: "Account Login successfully",
        code: 200,
        token,
        user
    }
}


module.exports = { createUser, loginUser };
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const logger = require("../config/winston");
require("dotenv").config();

const createUser = async ({ username, password }) => {
	const userDetails = { username, password };

	try {
		const existingUser = await userModel.findOne({
			username: userDetails.username,
        });
        
        console.log(existingUser)

		if (existingUser) {
			logger.error(
				`User account creation failed: User with email ${userDetails.username} already exists.`
			);
			return {
                message: "Oops! User already exist",
                existingUser,
				code: 409,
			};
		}

		const newUser = await userModel.create({
			username: userDetails.username,
			password: userDetails.password,
		});

		logger.info(`User account created: ${userDetails.username}`);
		return {
			message: "Account created successfully",
			code: 200,
			newUser,
		};
	} catch (error) {
		logger.error(`Error creating user account: ${error}`);
		console.error(error);
		return {
			message: "Internal server error",
			code: 500,
		};
	}
};

const loginUser = async ({ username, password }) => {
	const loginDetails = { username, password };

	try {
		const user = await userModel.findOne({
			username: loginDetails.username,
		});

		if (!user) {
			logger.error(`User login failed: User account not found for email ${loginDetails.username}`);
			return {
				code: 404,
				message: "Oops! User account not found",
			};
		}

		const validPassword = await user.isValidPassword(loginDetails.password);

		if (!validPassword) {
			logger.error(`User login failed: Invalid credentials for email ${loginDetails.username}`);
			return {
				code: 422,
				message: "Invalid credential. Username or Password is incorrect",
			};
		}

		const token = await jwt.sign(
			{ _id: user._id, username: user.username },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

        logger.info(`User account logged in: ${user.username}`)
		return {
			message: "Account Login successfully",
			code: 200,
			token,
			user,
		};
    } catch (error) {
        logger.error(`Error logging in user: ${error}`)
        console.error(error);
        return {
            message: "Internal server error",
            code: 500
        }
    }
};

module.exports = { createUser, loginUser };

const joi = require("joi")

const userValidator = async (req, res, next) => {
    try {
        const userSchema = joi.object({
            username: joi.string().empty().required().messages({
                "string.base": `"username" must be a text`,
                "string.empty": `"username" can not be emoty`,
                "string.required": `"username" is required`
            }),
            password: joi.string().empty().required().min(8).messages({
                "string.base": `"password" must be a text`,
                "string.empty": `"password" can not be emoty`,
                "string.required": `"password" is required`,
                "string.min": `"password" should have a minimum length of {8}`
            })
        })

        await userSchema.validateAsync(req.body, { abortEarly: true })
        next()
    } catch (error) {
        res.status(422).json({
            message: "Oops!. Wrong information inputted",
            "error": error.message
        })
    }
}


module.exports = { userValidator };
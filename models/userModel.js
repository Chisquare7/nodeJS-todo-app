const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const shortid = require("shortid")

const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate(),
        autoIncrement: true,
        required: true,
        unique: true,
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.pre("save", async function (next) {
    const passwordhash = await bcrypt.hash(this.password, 10)
    this.password = passwordhash
    next()
})

userSchema.methods.isValidPassword = async function (password) {
    const user = this
    const comparePassword = await bcrypt.compare(password, user.password)
    return comparePassword
}

const userModel = mongoose.model("users", userSchema)

module.exports = userModel
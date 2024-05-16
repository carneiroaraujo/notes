
const usersRouter = require("express").Router()
const User = require("../models/user")

const bcrypt = require("bcrypt")

usersRouter.post("/", async (request, response) => {
    const {username, name, password} = request.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    response
        .status(201)
        .json(await user.save())
})
usersRouter.get("/", async (request, response) => {
    response.json(await User.find({}).populate("notes", {content:1, important:1}))
})

module.exports = usersRouter
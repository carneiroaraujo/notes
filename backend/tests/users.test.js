const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const {describe, test, after, beforeEach} = require("node:test")
const assert = require("node:assert")

const api = require("supertest")(require("../app"))

const User = require("../models/user")
const helper = require("./test_helper")




describe("Using one user registered in DB", async () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash("sekret", 10)
        const user = new User({username: "root", passwordHash})
        await user.save()
    })
    test("creation succeeds with a fresh username", async () => {
        const newUser = {
            username: "mluukai",
            name: "Matti Luukkainen",
            password: "salainen"
        }
        const usersBefore = await helper.usersInDb()
        await api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("Content-Type", /application\/json/)
        const usersAfter = await helper.usersInDb()

        assert.strictEqual(usersAfter.length, usersBefore.length+1)

        assert(usersAfter.map(user=>user.username).includes(newUser.username))

        
    })
    test("creation fails returning proper statuscode and message if username already taken", async ()=> {
        const usersBefore = await helper.usersInDb()
        const newUser = {
            username: "root",
            name: "Superuser",
            password: "salainen"
        }
        const result = await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/)
        const usersAfter = await helper.usersInDb()
        assert(result.body.error.includes("expected `username` to be unique"))
        assert.strictEqual(usersAfter.length, usersBefore.length)


    })
})

after(async () => {
    await mongoose.connection.close()
})


const {test, after, beforeEach} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const app = require("../app")
const supertest = require("supertest")
const Note = require("../models/note")
const api = supertest(app)
const helper = require("./test_helper")

beforeEach(async () => {
    await Note.deleteMany({})
    // const objects = helper.initialNotes.
    const promiseArray = helper.initialNotes.map(note => (new Note(note)).save())
    await Promise.all(promiseArray)
 
})


test("idk what it does", async () => {
    await api.get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})
 
test("there are two notes", async () => {
    const response = await api.get("/api/notes")
    assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test("the first note is about HTTP methods", async () => {
    const response = await api.get("/api/notes")
    const contents = response.body.map(e => e.content)
    assert(contents.includes("html is easy"))
})

test("a valid note can be added", async () => {
    const note = {
        content: "async/await simplfies making async calls",
        important: true
    }

    await api.
        post("/api/notes")
        .send(note)
        .expect(201)
        .expect("Content-Type", /application\/json/)
    const contents = (await api.get("/api/notes")).body.map(n=>n.content)
    assert(contents.includes(note.content))
    assert.strictEqual(contents.length, helper.initialNotes.length+1)

})

test("note without content is not added", async () => {
    const note = {
        important:true
    }
    await api
        .post("/api/notes")
        .send(note)
        .expect(400)
    
    const response = await api.get("/api/notes")
    assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test("removed id is properly removed", async () => {
    const id = await helper.nonExistingId()
    assert(!(await helper.notesInDb()).includes(id))

})

test("a specific note can be viewed", async () => {
    const selectedNote = (await helper.notesInDb())[0]

    const result = await api
        .get(`/api/notes/${selectedNote.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
    assert.deepStrictEqual(result.body, selectedNote)

})

test("a note can be deleted", async () => {
    const selectedNote = (await helper.notesInDb())[0]
    await api
        .delete(`/api/notes/${selectedNote.id}`)
        .expect(204)
    
    const contents = (await helper.notesInDb()).map(note => note.content)
    assert.strictEqual(contents.length, helper.initialNotes.length-1)
    assert(!contents.includes(selectedNote.content))
})

after(async () => {
    await mongoose.connection.close()
})
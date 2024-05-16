const Note = require("../models/note")
const User = require("../models/user")

const initialNotes = [
  {
    content: 'html is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

async function nonExistingId() {
  const note = new Note({ content: "note to be removed" })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

async function notesInDb() {
  return (await Note.find({})).map(note=>note.toJSON())
}
async function usersInDb() {
  return (await User.find({})).map(user=>user.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,

}
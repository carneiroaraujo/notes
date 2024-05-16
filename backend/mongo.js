
 
require("dotenv").config()
const mongoose = require("mongoose")

const url = process.env.TEST_MONGODB_URI//`mongodb+srv://joaosheep95:${password}@cluster0.4qyvian.mongodb.net/noteApp?retryWrites=true&w=majority`
console.log(url);
mongoose.set("strictQuery", false)
mongoose.connect(url)
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})
const Note = mongoose.model('Note', noteSchema)


let note = new Note({
    content: "html is easy",
    important: true
})
let note1 = new Note({
    content: "is html easy?",
    important: true
})
note.save()
note1.save()
    .then(result => {
        mongoose.connection.close()
    })


// Note.find({}).then(result => {
//     result.forEach(note => console.log(note))
//     mongoose.connection.close()
// })
// note.save().then(result=>{
//     console.log("Note saved!");
//     mongoose.connection.close()
// })


require("dotenv").config()

const express = require("express")
// const cors = require("cors")
const app = express()
const morgan = require('morgan')

app.use(express.static("dist"))
app.use(express.json())
// app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)

  ].join(' ')
}))
const Note = require("./models/note")

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get("/", (request, response) => {
  response.send("<h1>hello world!</h1>")
})
app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) response.json(note)
      else response.status(404).end()
    })
    .catch(error => {
      next(error)
      // console.log(error)
      // response.status(400).send({ error: "malformatted id"})
    })


  // const note = notes.find(note=>note.id==id)
  // if (note) response.json(note)
  // else response.status(404).end()
})
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  // const id = Number(request.params.id)
  // console.log(`deleting`, id);
  // notes = notes.filter(note => note.id != id)
  // response.status(204).end()
})
app.post("/api/notes", (request, response, next) => {
  const body = request.body
  // if (!body.content) {
  //   return response.status(400).json({ error: "content missing" })
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note
    .save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})
app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important
  }
  console.log(body);
  Note.findByIdAndUpdate(request.params.id, note, {new:true, runValidators:true, context: "query"})
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

function unknownEnpoint(request, response, next) {
  response.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEnpoint)
function errorHandler(error, request, response, next) {
  console.log(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
})
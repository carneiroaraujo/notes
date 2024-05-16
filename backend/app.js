const express = require("express")
const app = express()
require("express-async-errors")
const cors = require("cors")
const mongoose = require("mongoose")
const notesRouter = require("./controllers/notes")
const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")

const logger = require("./utils/logger")
const config = require("./utils/config")
const middleware = require("./utils/middleware")
// const {requestLogger, unknownEnpoint, errorHandler} = require("./utils/middleware")

mongoose.set("strictQuery", false)
mongoose.connect(config.MONGODB_URI)
  .then(()=>{
    logger.info("Connected to MongoDB")
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", error.message)
  })


app.use(express.static("dist"))
app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use("/api/notes", notesRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)


app.use(middleware.unknownEnpoint)
app.use(middleware.errorHandler)


module.exports = app

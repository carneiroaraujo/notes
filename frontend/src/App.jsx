import noteService from './services/notes'
import loginService from './services/login'

import { useState, useEffect, useRef } from "react"
import Note from './components/Note'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Toggable from './components/Toggable'

function Footer() {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: "16"
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
    </div>
  )
}
const App = () => {
  const noteFormRef = useRef()

  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  const visibleNotes = showAll ? notes : notes.filter(note => note.important)
  useEffect(() => {
    console.log("effect");
    noteService.retrieveAll().then(retrievedNotes => {

      setNotes(retrievedNotes)
    })
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  async function handleLogin(event) {
    event.preventDefault()
    console.log("logging in with", username, password);
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user))

      noteService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  console.log("render", notes.length, "notes")
  function toggleImportanceOf(id) {
    const note = notes.find(note => note.id === id)
    const changedNote = { ...note, important: !note.important }
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage(`the note '${note.content}' was already deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id != id))
      })
  }
  function createNote(note) {
 
    noteFormRef.current.toggleVisibility()
    noteService.create(note).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })

  }

  function toggleVisibility() {
    setShowAll(!showAll)
  }

  return (
    <div>

      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null
        ?
        <Toggable buttonLabel="log in">
          <LoginForm
            onSubmit={handleLogin}
            username={username}
            password={password}
            onUsernameChange={setUsername}
            onPasswordChange={setPassword}
          />
        </Toggable>
        :
        <div>
          <p>{user.name} logged-in</p>
          <Toggable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={createNote}/>
          </Toggable>
        </div>
      }
      <div>
        <button onClick={toggleVisibility}>show {showAll ? 'important only' : 'all'}</button>
      </div>
      <ul>
        {visibleNotes.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => { toggleImportanceOf(note.id) }} />
        )}
      </ul>

      <Footer></Footer>
    </div>
  )
}

export default App
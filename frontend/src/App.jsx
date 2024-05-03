import noteService from './services/notes'
import { useState, useEffect } from "react"
import Note from './components/Note'
import Notification from './components/Notification'
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
  // const { notes } = props
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('new note text')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const visibleNotes = showAll ? notes : notes.filter(note => note.important)
  useEffect(() => {
    console.log("effect");
    noteService.retrieveAll().then(retrievedNotes => {

      setNotes(retrievedNotes)
    })
  }, [])
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
        setTimeout(()=>{
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(note => note.id != id))
      })
  }
  function addNote(event) {
    event.preventDefault()
    const noteObj = {
      content: newNote,
      important: Math.random() > 0.5,
    }
    noteService.create(noteObj).then(returnedNote => {
      setNotes(notes.concat(returnedNote))
    })

  }
  function handleNoteChange(event) {
    setNewNote(event.target.value)
  }
  function toggleVisibility() {
    setShowAll(!showAll)
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
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
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer></Footer>
    </div>
  )
}

export default App
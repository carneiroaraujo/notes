import { useState, useEffect } from "react";

function NoteForm({createNote}) {
  const [note, setNote] = useState("")
  function submit(event) {
    event.preventDefault()
    createNote({
      content: note,
      important: true
    })
  }
  return (
    <>
      <form onSubmit={submit}>
        <input value={note} onChange={({target})=>setNote(target.value)} />
        <button type="submit">save</button>
      </form>
    </>)
}

export default NoteForm
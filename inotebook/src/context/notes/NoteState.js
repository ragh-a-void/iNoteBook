import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const url = "http://localhost:5000";

  const [notesCxt, setNotesCxt] = useState([]);

  const fetchNotesCxt = async ()=> {
    const response = await fetch(`${url}/api/notes/fetchNotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem("iNotebookToken")
      }
    });
    const initialNotes = await response.json();
    // console.log(initialNotes);
    if(initialNotes.success){
      setNotesCxt(initialNotes.myNotes);
      showAlrtState("Success", "Your note has been fetched sucessfully!");
    }
    else{
      showAlrtState("Warning", typeof initialNotes.errors === 'string'? initialNotes.errors:initialNotes.errors[0].msg);
      // alert(typeof initialNotes.errors === 'string'? initialNotes.errors:initialNotes.errors[0].msg);
    }
  }

  const addNoteCxt = async (title, description, tag) => {
    const response = await fetch(`${url}/api/notes/addNote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("iNotebookToken")
      },
      body: JSON.stringify({title, description, tag})
    });
    const addedNote = await response.json();
    // console.log(addedNote);
    if(addedNote.success){
      setNotesCxt(notesCxt.concat(addedNote.myNote));
      showAlrtState("Success", "Your note has been added sucessfully!");
    }
    else{
      showAlrtState("Warning", typeof addedNote.errors === 'string'? addedNote.errors:addedNote.errors[0].msg);
      // alert(typeof addedNote.errors === 'string'? addedNote.errors:addedNote.errors[0].msg);
    }
  }

  const editNoteCxt = async (id, title, description, tag) => {
    const response = await fetch(`${url}/api/notes/updateNote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("iNotebookToken")
      },
      body: JSON.stringify({title, description, tag})
    });
    const editedNote = await response.json();
    // console.log(editedNote);

    if(editedNote.success){
      let newNotes = JSON.parse(JSON.stringify(notesCxt));
  
      for (let index = 0; index < newNotes.length; index++) {
        if (newNotes[index]._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotesCxt(newNotes);
      showAlrtState("Success", "Your note has been edited sucessfully!");
    }
    else{
      showAlrtState("Warning", typeof editedNote.errors === 'string'? editedNote.errors:editedNote.errors[0].msg);
      // alert(typeof editedNote.errors === 'string'? editedNote.errors:editedNote.errors[0].msg);
    }
  }

  const deleteNoteCxt = async (id) => {
    const response = await fetch(`${url}/api/notes/deleteNote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem("iNotebookToken")
      },
    });
    const deletedNote = await response.json();
    // console.log(deletedNote);
    if(deletedNote.success){
      let newNotes = notesCxt.filter((note) => { return note._id !== id });
      setNotesCxt(newNotes);
      showAlrtState("Success", "Your note has been deleted sucessfully!");
    }
    else{
      showAlrtState("Warning", typeof deletedNote.errors === 'string'? deletedNote.errors:deletedNote.errors[0].msg);
      // alert(typeof deletedNote.errors === 'string'? deletedNote.errors:deletedNote.errors[0].msg);
    }
  }

  const [alrtState, setAlrtState] = useState({
    vis: false,
    msg: "",
    type: ""
  });
  
  const showAlrtState = (t, m)=>{
    setAlrtState({
      vis: true,
      msg: m,
      type: t
    })
    setTimeout(() => {
      setAlrtState({
        vis: false,
        msg: "",
        type: ""
      });
      }, 3000);
  }

  return (
    <NoteContext.Provider value={{ url, notesCxt, fetchNotesCxt, addNoteCxt, editNoteCxt, deleteNoteCxt, alrtState, showAlrtState}}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
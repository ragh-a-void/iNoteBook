import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext, useEffect, useRef, useState } from 'react';
import NoteItem from './NoteItem';
import { useHistory } from 'react-router-dom'

export default function Notes() {
    const context = useContext(noteContext);
    const {notesCxt, fetchNotesCxt, editNoteCxt} = context;
    const history = useHistory();

    useEffect(() => {
        if(localStorage.getItem("iNotebookToken")){
            fetchNotesCxt();
        }
        else{
            history.push("/login");
        }
        // eslint-disable-next-line
    }, [])

    const ref = useRef(null);
    const refClose = useRef(null);
    const [note, setNote] = useState({eTitle:"", eDescription:"", eTag:""});

    const editNote = (currNote)=>{
        ref.current.click();
        setNote({
            id: currNote._id,
            eTitle: currNote.title,
            eDescription: currNote.description,
            eTag: currNote.tag,
        });
    }

    const clickedSaveNoteBtn = ()=>{
        document.getElementById('myeditform').reset();
        editNoteCxt(note.id, note.eTitle, note.eDescription, (note.eTag===""?"General":note.eTag));
        refClose.current.click();
    }

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value});
    }

    return (
        <div>

        <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <form id="myeditform">
                <div className="mb-3">
                    <label htmlFor="eTitle" className="form-label">Title</label>
                    <input type="text" className="form-control" id="eTitle" name="eTitle" value={note.eTitle} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="eDescription" className="form-label">Description</label>
                    <input type="text" className="form-control" id="eDescription" name="eDescription" value={note.eDescription} onChange={onChange}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="eTag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="eTag" name="eTag" value={note.eTag} onChange={onChange}/>
                </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button disabled={note.eTitle.length<3 || note.eDescription.length<5} type="button" className="btn btn-primary" onClick={clickedSaveNoteBtn}>Save</button>
            </div>
            </div>
        </div>
        </div>

            <div className='row my-3'>
                <h1>Your Notes</h1>
                <div className='container'>
                    {notesCxt.length===0 && "No notes to display!"}
                </div>
                {notesCxt.map((note)=>{
                    return <NoteItem key={note._id} editNote={editNote} note={note}/>;
                })}
            </div>
        </div>
    )
}

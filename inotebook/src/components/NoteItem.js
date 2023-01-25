import React from 'react'
import noteContext from '../context/notes/noteContext';
import { useContext } from 'react';

export default function NoteItem(props) {
    const context = useContext(noteContext);
    const { deleteNoteCxt } = context;

    return (
        <div className='col-md-4 my-3'>
            <div className="card mx-1">
            <div className="card-body">
                <div className="d-flex align-items-center">
                    <h5 className="card-title">{props.note.title}</h5>
                    <div className="position-absolute end-0 mx-2">
                        <i className="fas fa-trash-alt mx-2" onClick={()=>{deleteNoteCxt(props.note._id)}}></i>
                        <i className="fas fa-edit mx-2" onClick={()=>{props.editNote(props.note)}}></i>
                    </div>
                </div>
                <p className="card-text">{props.note.description}</p>
                <h6 className="card-text">{props.note.tag}</h6>
            </div>
            </div>
        </div>
    )
}

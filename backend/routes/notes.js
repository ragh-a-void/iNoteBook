const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get all notes using: GET "/api/notes/fetchNotes"; Login required
router.get('/fetchNotes', fetchUser, async (req, res)=>{
    success = false;
    const myNotes = await Note.find({user: req.user.id});
    success = true;
    res.json({success, myNotes});
})

// ROUTE 2: Add a new note using: Post "/api/notes/addNote"; Login required
router.post('/addNote', fetchUser, [
        body('title', 'Enter a title of minimum length 3').isLength({min:3}), 
        body('description', 'Enter a description of minimum length 5').isLength({min:5})
    ], async (req, res)=>{
    
    // In case of errors return bad request along with error messages
    success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // it is not working as express validator is doing it automatically so it is redundant
        return res.status(400).json({ success, errors: errors.array() });
    }
    try{
        const {title, description, tag} = req.body;
        const myNoteSave = await new Note({
            title, description, tag, user: req.user.id
        });
        const myNote = await myNoteSave.save();
        success = true;
        res.json({success, myNote});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({success, errors:"Internal server error"});
    }
})

// ROUTE 3: Update an existing note using: Post "/api/notes/updateNote"; Login required
router.put('/updateNote/:id', fetchUser, async (req, res)=>{
    try{
        const {title, description, tag} = req.body;
        let newNote = {};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};

        success = false;
        let myNote = await Note.findById(req.params.id);
        if(!myNote){ return res.status(401).json({success, errors:"Note not found"})}
        if(myNote.user.toString()!==req.user.id){
            return res.status(401).json({success, errors:"Access Denied"});
        }

        myNote = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        success = true;
        res.json({success, myNote});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({success, errors:"Internal server error"});
    }
})

// ROUTE 4: Delete an existing note using: Post "/api/notes/deleteNote"; Login required
router.delete('/deleteNote/:id', fetchUser, async (req, res)=>{
    success = false;
    try{
        let myNote = await Note.findById(req.params.id);
        if(!myNote){ return res.status(401).json({success, errors:"Note not found"})}
        if(myNote.user.toString()!==req.user.id){
            return res.status(401).json({success, errors:"Access Denied"});
        }

        myNote = await Note.findByIdAndDelete(req.params.id);
        success = true;
        res.json({success, myNote});
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({success, errors:"Internal server error"});
    }
})

module.exports = router;
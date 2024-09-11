import Note from '../models/Notes.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler'; //error handling middleware

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async(req, res) => {
    const notes = await Note.find().lean();

    if(!notes?.length) {
        return res.status(400).json({message: 'No notes found'});
    }
    res.json(notes);
})

// @desc Get note of a user
// @route GET /notes/:id
// @access Private
const getNote = asyncHandler(async(req, res) => {
    const { id } = req.params; //noteID

    // Check if id is provided
    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const note = await Note.findById(id).lean();

    if(!note) {
        return res.status(400).json({message: 'Note not found'});
    }
    res.json(note);
})

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async(req, res) => {
    const { 
        userID = '', 
        title = '', 
        content = '' 
    } = req.body;

    if(!userID || !title){
        return res.status(400).json({ message: 'All fields are required' });
    }

    const noteObject = { userID, title, content };
    const newNote = await Note.create(noteObject);

    if(newNote) {
        res.status(201).json({ message: `New note created`});
    } else {
        res.status(400).json({ message: 'Error while storing password'});
    }   
})

// @desc Update a user note
// @route PATCH /notes/:id
// @access Private
const updateNote = asyncHandler(async (req, res) => {

    const { id } = req.params; //noteID
    const { title, content } = req.body;

    if(!id || !title){
        return res.status(400).json({ message: 'Please add title to note'});
    }

    const oldNote = await Note.findById(id).exec();

    if(!oldNote) {
        return res.status(400).json({ message: 'Note not found'});
    }

    oldNote.title = title;
    oldNote.content = content;

    const updatedNote = await oldNote.save();

    res.json({ message: `Note titled: ${updatedNote.title}, updated successfully` })
})

// @desc Delete a user note
// @route DELETE /notes/:id
// @access Private
const deleteNote = asyncHandler(async (req, res) => {

    const { id } = req.params; //noteID
    
    if(!id){
        return res.status(400).json({ message: 'Note ID Required'});
    }

    const note = await Note.findById(id).exec();

    if(!note){
        return res.status(400).json({ message: 'Note not found'});
    }

    const result = await note.deleteOne();

    const reply = `Note titled: ${note.title}, deleted successfully`;

    res.json({ message: reply });
})

export {
    getAllNotes,
    createNewNote,
    getNote,
    updateNote,
    deleteNote
};
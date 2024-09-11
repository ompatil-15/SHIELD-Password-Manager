import Password from '../models/Passwords.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler'; //error handling middleware

// @desc Get all passwords
// @route GET /passwords
// @access Private
const getAllPasswords = asyncHandler(async(req, res) => {
    const passwords = await Password.find().lean();

    if(!passwords?.length) {
        return res.status(400).json({message: 'No passwords found'});
    }
    res.json(passwords);
})

// @desc Get password of a user
// @route GET /passwords/:id
// @access Private
const getPassword = asyncHandler(async(req, res) => {
    const { id } = req.params; //passwordID

    // Check if id is provided
    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const password = await Password.findById(id).lean();

    if(!password) {
        return res.status(400).json({message: 'Password not found'});
    }
    res.json(password);
})

// @desc Create new password
// @route POST /passwords
// @access Private
const createNewPassword = asyncHandler(async(req, res) => {
    const { 
        userID = '', 
        website = '', 
        username = '', 
        password = '', 
        note = ''
    } = req.body;

    if(!userID || !website || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await Password.findOne({ userID, website }).lean().exec();

    if(duplicate) {
        return res.status(409).json({ message: 'Website already exists'});
    }

    const passwordObject = { userID, website, username, password, note };
    const newPassword = await Password.create(passwordObject);

    if(newPassword) {
        res.status(201).json({ message: `New password for ${website} created`});
    } else {
        res.status(400).json({ message: 'Error while storing password'});
    }   
})

// @desc Update a user password
// @route PATCH /password/:id
// @access Private
const updatePassword = asyncHandler(async (req, res) => {

    const { id } = req.params; //passwordID
    const { username, password, note } = req.body;

    // if(!password){
    //     return res.status(400).json({ message: 'All fields are required'});
    // }

    const oldPassword = await Password.findById(id).exec();

    if(!oldPassword) {
        return res.status(400).json({ message: 'Password entry not found'});
    }

    oldPassword.username = username;
    oldPassword.password = password;
    oldPassword.note = note;

    const updatedPassword = await oldPassword.save();

    res.json({ message: `Password record for ${updatedPassword.website} updated successfully` })
})

// @desc Delete a user password
// @route DELETE /passwords/:id
// @access Private
const deletePassword = asyncHandler(async (req, res) => {

    const { id } = req.params; //passwordID
    
    if(!id){
        return res.status(400).json({ message: 'Password ID Required'});
    }

    const password = await Password.findById(id).exec();

    if(!password){
        return res.status(400).json({ message: 'Password record not found'});
    }

    const result = await password.deleteOne();

    const reply = `Password record for ${password.website} deleted`;

    res.json({ message: reply });
})

export { 
    getAllPasswords,
    getPassword,
    createNewPassword,
    updatePassword,    
    deletePassword
};
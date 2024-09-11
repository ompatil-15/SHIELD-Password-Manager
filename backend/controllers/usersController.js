import User from '../models/Users.js';
import Note from '../models/Notes.js'
import Password from '../models/Passwords.js';
import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler'; //error handling middleware
// handle enryption on the client-side (Zero Knowledge Architecture)
// import { encrypt, decrypt } from '../utils/AES256Encryption.js'; //AES256 encryption

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();
    // const users = await User.find().lean();

    if(!users?.length) {
        return res.status(400).json({message: 'No users found'});
    }
    res.json(users);
})

// @desc Get a user
// @route GET /users/:id
// @access Private
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if(!id || !mongoose.isValidObjectId(id)){
        return res.status(400).json({ message: 'All fields are required'});
    }

    const user = await User.findById(id).select('-password').lean();
    // const user = await User.findById(id).lean();

    if(!user) {
        return res.status(400).json({message: 'User not found'});
    }
    res.json(user);
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { 
        fullName = '', 
        email = '', 
        password = '', 
        phone = '', 
        address = '', 
        dob = '', 
        pan = '', 
        aadhaar = '', 
        passport = '' 
    } = req.body;
    
    if(!fullName || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }

    //lean strips extra mongoos methods
    //exec to get back a promise when you pass in value not need when no valeus passed like find()
    const duplicate = await User.findOne({ email }).lean().exec();

    if(duplicate) {
        return res.status(409).json({ message: 'Email already exists'});
    }

    // const encryptedPassword = encrypt(password);

    const userObject = { fullName, email, password, phone, dob, address, pan, aadhaar, passport}

    const user = await User.create(userObject);

    if(user) {
        res.status(201).json({ message: `New user ${email} created`});
    } else {
        res.status(400).json({ message: 'Error while creating user'});
    }
})

// @desc Update a user
// @route PATCH /users/:id
// @access Private
const updateUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    // const { id, fullName, email, password, phone, address, dob, pan, aadhaar, passport} = req.body;
    const { fullName, email, password, phone, address, dob, pan, aadhaar, passport} = req.body;

    if(!id){
        return res.status(400).json({ message: 'All fields are required'});
    }

    const user = await User.findById(id).exec();

    if(!user) {
        return res.status(400).json({ message: 'User not found'});
    }

    const duplicate = await User.findOne({ email }).lean().exec();
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Email already exits'});
    }

    user.fullName = fullName;
    // user.email = email;
    user.phone = phone;
    user.address = address;
    user.dob = dob;
    user.pan = pan;
    user.aadhaar = aadhaar;
    user.passport = passport;

    if(password) {
        user.password = password;
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.email} updated successfully` })
})

// @desc Delete a user
// @route DELETE /users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

    const { id } = req.params;
    // const { id } = req.body;
    
    if(!id){
        return res.status(400).json({ message: 'User ID Required'});
    }

    const user = await User.findById(id).exec();

    if(!user){
        return res.status(400).json({ message: 'User not found'});
    }

    const result = await user.deleteOne();

    const reply = `${user.email} with ID ${user._id} deleted`;

    res.json({ message: reply });
})

// @desc Get all user passwords
// @route GET /users/:id/:passwords
// @access Private
const getUserPasswords = asyncHandler(async(req, res) => {
    const { id } = req.params; //userID

    // Check if userID is provided
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const passwords = await Password.find({ userID: id }).lean();

    if(!passwords?.length) {
        return res.status(400).json({message: 'No passwords found'});
    }
    res.json(passwords);
})

// @desc Get all user notes
// @route GET /users/:id/notes
// @access Private
const getUserNotes = asyncHandler(async(req, res) => {
    const { id } = req.params; //userID

    // Check if userID is provided
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const notes = await Note.find({ userID: id }).lean();

    if(!notes?.length) {
        return res.status(400).json({message: 'No notes found'});
    }
    res.json(notes);
})

export { 
    getAllUsers,
    getUserPasswords,
    getUserNotes,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
};
import { mongoose } from 'mongoose';

/*
{   userID, 
    fullName, 
    email, 
    password, 
    phone, 
    address, 
    dob, 
    PAN, 
    Aadhaar, 
    Passport, }
*/ 

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            streetAddress: {
                type: String,
                required: false,
            },
            city: {
                type: String,
                required: false,
            },
            state: {
                type: String,
                required: false,
            },
            country: {
                type: String,
                required: false,
            },
            pincode: {
                type: String,
                required: false,
            },
        },
        dob: {
            type: Date,
            required: false,
        },
        pan: {
            type: String,
            required: false,
        },
        aadhaar: {
            type: String,
            required: false,
        },
        passport: {
            type: String,
            required: false,
        },
    }, 
    {
        timestamps: true, 
    }
);

const User = mongoose.model('User',  userSchema);

export default User;
import mongoose from 'mongoose';

const passwordSchema = new mongoose.Schema(
    {   
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        website: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            required: false,
        }
    }, 
    {
        timestamps: true, 
    }
);

const Password = mongoose.model('Password', passwordSchema);

export default Password;

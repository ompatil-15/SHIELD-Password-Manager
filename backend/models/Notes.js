import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model('Note', noteSchema);

export default Note;

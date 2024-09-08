import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    villa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Villa',
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model('Review', ReviewSchema);
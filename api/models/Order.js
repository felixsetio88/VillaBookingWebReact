import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    hotel: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotel', 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    orderDate: { 
        type: Date, 
        default: Date.now 
    },
    confirmed: { 
        type: Boolean, 
        default: false
    },
    canceled: {
        type: Boolean,
        default: false
    },
    total: { 
        type: Number, 
        required: true
    },
    roomNumber: {
        type: Number
    }
}, { timestamps: true });

export default mongoose.model("Order", OrderSchema)
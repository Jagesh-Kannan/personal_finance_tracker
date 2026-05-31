import mongoose from 'mongoose';
import { Currency_types, payment_modes } from '../controller/enums/expense.enum.js';

const expense_schema = new mongoose.Schema({
    expenseName : {
        type: String,
        required: true
    },
    expenseCategory : {
        type: String,
        required: true
    },
    amount : {
        type: Number,
        min:1,
        required: true
    },
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    paymentMode : {
        type: String,
        enum: payment_modes,
        required: true
    },
    mode: {
        type: String,
        default: 'DEBITED',
        enum: ['DEBITED','CREDITED'],
        required: true
    },
    senderOrReceiver: {
        type: String,
    },
    expenseDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    currency: {
        type: String,
        default: 'INR',
        enum: Currency_types
    },
    customGrouping: {
        type: String
    }
}, { timestamps: true });

 
const expense_modal = mongoose.model('expense',expense_schema);

export default expense_modal;
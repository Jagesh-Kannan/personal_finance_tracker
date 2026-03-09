const mongoose = require('mongoose');
const { Currency_types, payment_modes } = require('../controller/enums/expense.enum');

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

module.exports = expense_modal;
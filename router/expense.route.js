const express = require('express');
const { save_expenses, getAll_expenses, get_expenses, delete_expense, delete_multiple_expenses } = require('../controller/expense.controller');

const expense_route = express.Router();

expense_route.post('/create', save_expenses);
expense_route.get('/getAll', getAll_expenses);
expense_route.get('/get', get_expenses);
expense_route.delete('/delete', delete_expense);
expense_route.delete('/deleteMultiple', delete_multiple_expenses);

module.exports = expense_route;
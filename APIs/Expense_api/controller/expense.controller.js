import expense_modal from '../modal/expense.modal.js';
import { catchAsync } from '../utils/catchAsync.js';
import mongoose from 'mongoose';

// to create single expense as an object
const create_expense = catchAsync(async (req, res, next) => {
    req.body.userId = req.user.id; // Attach user ID from authenticated request
    const newExpense = await expense_modal.create(req.body);
    res.status(201).json({
        "status": "success",
        "message": "Expense recorded successfully."
    })
});

// to create bulk document as an array of object
const create_bulk_expense = catchAsync(async (req, res, next) => {
    const expenses = req.body.map(expense => ({ ...expense, userId: req.user.id })); // Attach user ID to each expense
    const newExpense = await expense_modal.insertMany(expenses);
    res.status(201).json({
        "status": "success",
        "message": "Bulk Expense recorded successfully."
    })
});

// middleware to validate and return single and bulk operation
const save_expenses = (req, res, next) => {
    if (Array.isArray(req.body)) {
        return create_bulk_expense(req, res, next);
    } else {
        return create_expense(req, res, next);
    }
};

const update_expense = catchAsync(async (req, res, next) => {

     req.body.userId = req.user.id; 

    const expenseId = req.body._id || new mongoose.Types.ObjectId();

    const result = await expense_modal.findByIdAndUpdate(
        expenseId, 
        req.body, 
        { 
          new: true,          
          upsert: true,      
          runValidators: true 
        }
    );

    res.status(200).json({
        "status": "success",
        "message": "Expense updated successfully."
    });
});

const getAll_expenses = catchAsync(async (req, res, next) => {
    const expenses = await expense_modal.find({ userId: req.user.id });
    res.status(200).json({
        "status": "success",
        "data": expenses
    });
});

const get_expenses = catchAsync(async (req, res, next) => {
    const {
        id,
        expenseName,
        expenseCategory,
        senderOrReceiver,
        amount_gt,
        amount_lt,
        amount_gte,
        amount_lte,
        amount_eq,
        amount_between,
        paymentMode,
        mode,
        expenseDate_gt,
        expenseDate_lt,
        expenseDate_eq,
        expenseDate_between,
        customGrouping
    } = req.query;

    const filter = {};

    if (expenseName) {
        filter.expenseName = { $regex: expenseName, $options: "i" };
    }
    if (expenseCategory) {
        filter.expenseCategory = { $regex: expenseCategory, $options: "i" };
    }
    if(senderOrReceiver){
        filter.senderOrReceiver = { $regex: senderOrReceiver, $options: "i" };
    }
    if (customGrouping) {
        filter.customGrouping = { $regex: customGrouping, $options: "i" };
    }

    // Amount filters
    if (amount_between) {
        const [min, max] = amount_between.split(",").map(Number);
        if (!isNaN(min) && !isNaN(max)) filter.amount = { $gte: min, $lte: max };
    } else {
        if (amount_gt) filter.amount = { ...filter.amount, $gt: Number(amount_gt) };
        if (amount_gte) filter.amount = { ...filter.amount, $gte: Number(amount_gte) };
        if (amount_lt) filter.amount = { ...filter.amount, $lt: Number(amount_lt) };
        if (amount_lte) filter.amount = { ...filter.amount, $lte: Number(amount_lte) };
        if (amount_eq) filter.amount = { $eq: Number(amount_eq) };
    }

    // PaymentMode and mode (multiple values)
    if (paymentMode) {
        const modes = paymentMode.split(",");
        filter.paymentMode = { $in: modes };
    }
    if (mode) {
        const modes = mode.split(",");
        filter.mode = { $in: modes };
    }

    // ExpenseDate filters
    if (expenseDate_between) {
        const [start, end] = expenseDate_between.split(",");
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (!isNaN(startDate) && !isNaN(endDate)) {
            filter.expenseDate = { $gte: startDate, $lte: endDate };
        }
    } else {
        if (expenseDate_gt) {
            const gtDate = new Date(expenseDate_gt);
            if (!isNaN(gtDate)) filter.expenseDate = { ...filter.expenseDate, $gt: gtDate };
        }
        if (expenseDate_lt) {
            const ltDate = new Date(expenseDate_lt);
            if (!isNaN(ltDate)) filter.expenseDate = { ...filter.expenseDate, $lt: ltDate };
        }
        if (expenseDate_eq) {
            const eqDate = new Date(expenseDate_eq);
            if (!isNaN(eqDate)) filter.expenseDate = { $eq: eqDate };
        }
    }

    // Handle single expense by ID
    if (id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                "status": "error",
                "message": "Invalid expense ID format."
            });
        }
        const expense = await expense_modal.findOne({ _id: id, userId: req.user.id });
        // NULL CHECK FIX: Return 404 if expense not found instead of returning null
        if (!expense) {
            return res.status(404).json({
                "status": "error",
                "message": "Expense not found."
            });
        }
        return res.status(200).json({
            "status": "success",
            "data": expense
        });
    }

    // Handle filtered expenses
    const expenses = await expense_modal.find({ ...filter, userId: req.user.id });
    res.status(200).json({
        status: "success",
        results: expenses.length,
        data: expenses
    });
});

const delete_expense = catchAsync(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({
            "status": "error",
            "message": "Expense ID is required."
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            "status": "error",
            "message": "Invalid expense ID format."
        });
    }
    // SECURITY FIX: Add userId filter to prevent users from deleting other users' expenses
    const deletedExpense = await expense_modal.findByIdAndDelete({
        _id: id,
        userId: req.user.id
    });
    if (!deletedExpense) {
        return res.status(404).json({
            "status": "error",
            "message": "Expense not found."
        });
    }
    res.status(200).json({
        status: "success",
        message: "Expense deleted successfully.",
        data: deletedExpense
    });
});

// Delete multiple expenses
// Supports three methods:
// 1. Query: ?ids=id1,id2,id3 (comma-separated IDs)
// 2. Body: [id1, id2, id3] (array of IDs)
// 3. Filter: Query params for filter-based deletion
const delete_multiple_expenses = catchAsync(async (req, res, next) => {
    let ids = [];
    let filter = {};

    // Method 1: Multiple IDs from query string
    if (req.query.ids) {
        ids = req.query.ids.split(",").map(id => id.trim());
    }
    // Method 2: Array of IDs in request body
    else if (Array.isArray(req.body)) {
        ids = req.body;
    }
    // Method 3: Filter-based deletion (using same filter logic as get_expenses)
    else if (Object.keys(req.body).length > 0) {
        filter = buildDeleteFilter(req.body);
    }
    else {
        return res.status(400).json({
            "status": "error",
            "message": "Provide either 'ids' query parameter, array of IDs in body, or filter criteria."
        });
    }

    // VALIDATION FIX: Check for empty array
    if (ids.length === 0 && Object.keys(filter).length === 0) {
        return res.status(400).json({
            "status": "error",
            "message": "Please provide at least one expense ID or filter criteria."
        });
    }

    // Validate IDs if provided
    if (ids.length > 0) {
        const invalidIds = ids.filter(id => !mongoose.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            return res.status(400).json({
                "status": "error",
                "message": `Invalid expense ID format: ${invalidIds.join(", ")}`
            });
        }
        filter = { _id: { $in: ids.map(id => new mongoose.Types.ObjectId(id)) } };
    }

    // SECURITY FIX: Add userId filter to ensure user can only delete their own expenses
    filter.userId = req.user.id;

    const result = await expense_modal.deleteMany(filter);

    if (result.deletedCount === 0) {
        return res.status(404).json({
            "status": "error",
            "message": "No expenses found to delete."
        });
    }

    res.status(200).json({
        status: "success",
        message: `${result.deletedCount} expense(s) deleted successfully.`,
        deletedCount: result.deletedCount
    });
});

const delete_all_expenses = catchAsync(async (req, res, next) => {
    const result = await expense_modal.deleteMany({ userId: req.user.id });
    res.status(200).json({
        status: "success",
        message: `${result.deletedCount} expense(s) deleted successfully.`,
        deletedCount: result.deletedCount
    });
});

// Helper function to build filter for delete operation
const buildDeleteFilter = (params) => {
    const filter = {};

    if (params.expenseName) {
        filter.expenseName = { $regex: params.expenseName, $options: "i" };
    }
    if (params.expenseCategory) {
        filter.expenseCategory = { $regex: params.expenseCategory, $options: "i" };
    }
    if (params.paymentMode) {
        filter.paymentMode = { $in: params.paymentMode.split(",") };
    }
    if (params.mode) {
        filter.mode = { $in: params.mode.split(",") };
    }
    if (params.amount) {
        filter.amount = Number(params.amount);
    }
    if (params.customGrouping) {
        filter.customGrouping = { $regex: params.customGrouping, $options: "i" };
    }

    return filter;
};


export {
    save_expenses,
    update_expense,
    getAll_expenses,
    get_expenses,
    delete_expense,
    delete_multiple_expenses,
    delete_all_expenses,
};
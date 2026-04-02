import { handle_validation_error } from '../errorHandler/validationError.handler.js';

export const handle_error = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    console.error(err);

    switch (err.name) {
        case 'ValidationError':
            statusCode = 400;
            message = handle_validation_error(err);
            break;
        case 'CastError':
            statusCode = 400;
            message = `Invalid ${err.path}: ${err.value}.`;
            break;
        default:
            break;
    }

    res.status(statusCode).json({
        status: 'error',
        message: message
    });

};


// import { handle_validation_error } from "../errorHandler/validationError.handler.js";

// export const handle_error = (err, req, res, next) => {
//     console.error(err);

//     // Handle Mongoose validation errors
//     if (err.name === "ValidationError" || err.code === 11000) {
//         const errorResponse = handle_validation_error(err);
//         return res.status(errorResponse.statusCode).json({
//             status: errorResponse.status,
//             errors: errorResponse.errors
//         });
//     }

//     // Handle custom application errors
//     if (err.statusCode) {
//         return res.status(err.statusCode).json({
//             status: "error",
//             message: err.message,
//             ...(err.details && { details: err.details })
//         });
//     }

//     // Handle unexpected errors
//     res.status(500).json({
//         status: "error",
//         message: "Internal Server Error",
//         ...(process.env.NODE_ENV === "development" && { error: err.message })
//     });
// };
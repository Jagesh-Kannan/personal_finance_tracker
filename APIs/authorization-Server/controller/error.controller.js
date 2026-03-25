import { handle_validation_error } from "../errorHandler/validationError.handler.js";

export const handle_error = (err, req, res, next) => {
    console.error(err);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError" || err.code === 11000) {
        const errorResponse = handle_validation_error(err);
        return res.status(errorResponse.statusCode).json({
            status: errorResponse.status,
            errors: errorResponse.errors
        });
    }

    // Handle custom application errors
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
            ...(err.details && { details: err.details })
        });
    }

    // Handle unexpected errors
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { error: err.message })
    });
};
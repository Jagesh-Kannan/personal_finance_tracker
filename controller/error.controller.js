const { handle_validation_error } = require("../errorHandler/validationError.handler.js");

module.exports.handle_error = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    console.error(err);

    switch (err.name) {
        case "ValidationError":
            statusCode = 400;
            message = handle_validation_error(err);
            break;
        case "CastError":
            statusCode = 400;
            message = `Invalid ${err.path}: ${err.value}.`;
            break;
        default:
            break;
    }

    res.status(statusCode).json({
        status: "error",
        message: message
    });

};
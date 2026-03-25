export const handle_validation_error = (err) => {
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map(val => format_validation_error(val));
        return {
            status: "validation_error",
            statusCode: 400,
            errors: errors
        };
    } else if (err.name === "MongoServerError" && err.code === 11000) {
        // Handle duplicate key error
        const field = Object.keys(err.keyPattern)[0];
        return {
            status: "duplicate_error",
            statusCode: 409,
            errors: [{ field, message: `${field} already exists` }]
        };
    } else {
        return {
            status: "validation_error",
            statusCode: 400,
            errors: [{ message: "Validation failed" }]
        };
    }
};

const format_validation_error = (err) => {
    let message = "Invalid value";

    if (err.kind === "required") {
        message = `${err.path} is required`;
    } else if (err.kind === "minlength") {
        message = `${err.path} must be at least ${err.properties.minlength} characters`;
    } else if (err.kind === "maxlength") {
        message = `${err.path} must not exceed ${err.properties.maxlength} characters`;
    } else if (err.kind === "regexp") {
        message = `${err.path} format is invalid`;
    } else if (err.kind === "user defined") {
        message = err.message;
    } else if (err.message) {
        message = err.message;
    }

    return {
        field: err.path,
        message: message
    };
};